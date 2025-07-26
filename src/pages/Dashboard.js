import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlusCircle, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiClock, 
  FiCheckCircle,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiPackage
} from 'react-icons/fi';
import { formatCurrency, formatDateTime, formatOrderStatus, getStatusColor } from '../utils/formatters';
import toast from 'react-hot-toast';

const Dashboard = ({ stats, onStatsUpdate }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentOrders();
  }, []);

  const loadRecentOrders = async () => {
    try {
      const result = await window.electronAPI.getOrders();
      if (result.success) {
        setRecentOrders(result.data.slice(0, 5)); // Show only last 5 orders
      }
    } catch (error) {
      console.error('Error loading recent orders:', error);
      toast.error('Erreur lors du chargement des commandes récentes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await window.electronAPI.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success('Statut de la commande mis à jour');
        loadRecentOrders();
        onStatsUpdate();
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
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

  const statCards = [
    {
      title: 'Revenus du jour',
      value: formatCurrency(stats.todayRevenue),
      icon: FiTrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenus du mois',
      value: formatCurrency(stats.monthRevenue),
      icon: FiDollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Commandes en attente',
      value: stats.pendingOrders,
      icon: FiClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Bénéfice du mois',
      value: formatCurrency(stats.monthProfit),
      icon: FiCheckCircle,
      color: stats.monthProfit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.monthProfit >= 0 ? 'bg-green-50' : 'bg-red-50'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre activité de blanchisserie
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/new-order"
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg p-6 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <FiPlusCircle className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">Nouvelle commande</h3>
              <p className="text-primary-100">Créer une nouvelle commande</p>
            </div>
          </div>
        </Link>

        <Link
          to="/orders"
          className="bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg p-6 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <FiPackage className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">Gérer les commandes</h3>
              <p className="text-secondary-100">Voir et modifier les commandes</p>
            </div>
          </div>
        </Link>

        <Link
          to="/expenses"
          className="bg-warning-600 hover:bg-warning-700 text-white rounded-lg p-6 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <FiDollarSign className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">Gérer les dépenses</h3>
              <p className="text-warning-100">Ajouter et suivre les dépenses</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Commandes récentes
            </h2>
            <Link
              to="/orders"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Voir toutes →
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement des commandes...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-6 text-center">
              <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande récente</p>
              <Link
                to="/new-order"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
              >
                Créer votre première commande
              </Link>
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.customer_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer_phone}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {formatCurrency(order.total_amount)}
                          </span>
                          <span className="text-sm text-gray-500">
                            <FiCalendar className="inline w-4 h-4 mr-1" />
                            {formatDateTime(order.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                      {formatOrderStatus(order.status)}
                    </span>
                    <div className="flex space-x-1">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'completed')}
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                          title="Marquer comme terminé"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'picked_up')}
                          className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                          title="Marquer comme récupéré"
                        >
                          <FiPackage className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 