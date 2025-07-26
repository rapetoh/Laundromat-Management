import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiCheckCircle, 
  FiPackage, 
  FiX,
  FiCalendar,
  FiUser,
  FiPhone,
  FiDollarSign
} from 'react-icons/fi';
import { formatCurrency, formatDateTime, formatOrderStatus, getStatusColor } from '../utils/formatters';
import toast from 'react-hot-toast';
import Receipt from '../components/Receipt';

const Orders = ({ onOrderUpdated }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      const result = await window.electronAPI.getOrders();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(term) ||
        order.customer_phone?.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await window.electronAPI.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success('Statut de la commande mis à jour');
        loadOrders();
        onOrderUpdated();
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleViewReceipt = (order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  const getStatusBadgeColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      picked_up: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'completed', label: 'Terminé' },
    { value: 'picked_up', label: 'Récupéré' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (showReceipt && selectedOrder) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Reçu de commande
              </h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <Receipt order={selectedOrder} />

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowReceipt(false)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Commandes
        </h1>
        <p className="text-gray-600">
          Gérez toutes vos commandes de blanchisserie
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, téléphone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} trouvée{filteredOrders.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune commande trouvée
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre première commande'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
              
              return (
                <div key={order.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {order.customer_name}
                          </h3>
                          {order.customer_phone && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <FiPhone className="w-3 h-3 mr-1" />
                              {order.customer_phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="w-4 h-4 mr-2" />
                          <span>Commande #{order.id}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiDollarSign className="w-4 h-4 mr-2" />
                          <span>{formatCurrency(order.total_amount)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiPackage className="w-4 h-4 mr-2" />
                          <span>{items.length} article{items.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        Créé le {formatDateTime(order.created_at)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {formatOrderStatus(order.status)}
                      </span>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewReceipt(order)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                          title="Voir le reçu"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                            title="Marquer comme terminé"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status === 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'picked_up')}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                            title="Marquer comme récupéré"
                          >
                            <FiPackage className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items Preview */}
                  {items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {items.slice(0, 3).map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                        {items.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{items.length - 3} autres
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 