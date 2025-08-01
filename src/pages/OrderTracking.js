import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertTriangle, FiClock, FiCheckCircle, FiPackage, FiCalendar, FiUser, FiPhone, FiDollarSign, FiPrinter, FiEye, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import { formatCurrency, formatDateTime, formatOrderStatus, getStatusColor, formatPickupDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import Receipt from '../components/Receipt';

const OrderTracking = ({ onOrderUpdated }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const loadOrders = async () => {
    try {
      const response = await window.electronAPI.getOrders();
      if (response && response.success && response.data) {
        setOrders(response.data);
      } else {
        console.error('Invalid orders response:', response);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error(t('orders.errorLoading'));
      setOrders([]);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone.includes(searchTerm) ||
        order.id.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      
      switch (dateFilter) {
        case 'overdue':
          filtered = filtered.filter(order => 
            new Date(order.pickup_date) < today && order.status === 'pending'
          );
          break;
        case 'today':
          filtered = filtered.filter(order => 
            new Date(order.pickup_date).toDateString() === today.toDateString() && order.status === 'pending'
          );
          break;
        case 'tomorrow':
          filtered = filtered.filter(order => 
            new Date(order.pickup_date).toDateString() === tomorrow.toDateString() && order.status === 'pending'
          );
          break;
        case 'this_week':
          const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => 
            new Date(order.pickup_date) >= today && 
            new Date(order.pickup_date) <= weekEnd && 
            order.status === 'pending'
          );
          break;
        default:
          break;
      }
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setPendingStatusChange({ orderId, newStatus });
    setShowStatusConfirm(true);
  };

  const confirmStatusUpdate = async () => {
    if (!pendingStatusChange) return;
    
    try {
      await window.electronAPI.updateOrderStatus(pendingStatusChange.orderId, pendingStatusChange.newStatus);
              toast.success(t('orders.statusUpdated'));
      loadOrders();
      onOrderUpdated();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(t('orders.errorUpdating'));
    } finally {
      setShowStatusConfirm(false);
      setPendingStatusChange(null);
    }
  };

  const handleViewReceipt = (order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  const handlePrintReceipt = (order) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
      printWindow.document.write(`
        <html>
          <head>
            <title>Pressia Receipt - Order #${order.id}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background: white; 
              }
              .receipt { 
                max-width: 400px; 
                margin: 0 auto; 
                border: 1px solid #ccc; 
                padding: 20px; 
              }
              .header { text-align: center; margin-bottom: 20px; }
              .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
              .items { margin: 15px 0; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h1>Pressia - Laundry Receipt</h1>
              </div>
              <p><strong>Order:</strong> #${order.id}</p>
              <p><strong>Customer:</strong> ${order.customer_name}</p>
              <p><strong>Phone:</strong> ${order.customer_phone}</p>
              <p><strong>Pickup Date:</strong> ${formatPickupDate(order.pickup_date)}</p>
              <p><strong>Status:</strong> ${formatOrderStatus(order.status)}</p>
              <div class="items">
                <h3>Items:</h3>
                ${items.map(item => `
                  <div class="item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${formatCurrency(item.price * item.quantity)}</span>
                  </div>
                `).join('')}
              </div>
              <div class="total">
                <strong>Total: ${formatCurrency(order.total_amount)}</strong>
              </div>
              <div style="margin-top: 20px; text-align: center;">
                Thank you for choosing Pressia!
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      picked_up: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getOrderPriority = (order) => {
    const today = new Date();
    const pickupDate = new Date(order.pickup_date);
    const daysUntilPickup = Math.ceil((pickupDate - today) / (1000 * 60 * 60 * 24));
    
    if (pickupDate < today && order.status === 'pending') return 'overdue';
    if (daysUntilPickup === 0 && order.status === 'pending') return 'today';
    if (daysUntilPickup === 1 && order.status === 'pending') return 'tomorrow';
    if (daysUntilPickup <= 3 && order.status === 'pending') return 'urgent';
    return 'normal';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      overdue: 'border-red-500 bg-red-50',
      today: 'border-orange-500 bg-orange-50',
      tomorrow: 'border-yellow-500 bg-yellow-50',
      urgent: 'border-blue-500 bg-blue-50',
      normal: 'border-gray-200 bg-gray-50'
    };
    return colors[priority] || colors.normal;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      overdue: FiAlertTriangle,
      today: FiClock,
      tomorrow: FiClock,
      urgent: FiClock,
      normal: FiCalendar
    };
    return icons[priority] || FiCalendar;
  };

  const getPriorityText = (priority) => {
    const texts = {
      overdue: t('orders.overdue'),
      today: t('orders.dueToday'),
      tomorrow: t('orders.dueTomorrow'),
      urgent: t('orders.dueSoon'),
      normal: 'Normal'
    };
    return texts[priority] || 'Normal';
  };

  const getPriorityTextColor = (priority) => {
    const colors = {
      overdue: 'text-red-600',
      today: 'text-orange-600',
      tomorrow: 'text-yellow-600',
      urgent: 'text-blue-600',
      normal: 'text-gray-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const statusOptions = [
    { value: 'all', label: t('orders.allStatuses') },
    { value: 'pending', label: t('orders.pending') },
    { value: 'completed', label: t('orders.completed') },
    { value: 'picked_up', label: t('orders.pickedUp') },
    { value: 'cancelled', label: t('orders.cancelled') }
  ];

  const dateOptions = [
    { value: 'all', label: t('orders.allDates') },
    { value: 'overdue', label: t('orders.overdue') },
    { value: 'today', label: t('orders.dueToday') },
    { value: 'tomorrow', label: t('orders.dueTomorrow') },
    { value: 'this_week', label: t('orders.thisWeek') }
  ];

  if (showReceipt && selectedOrder) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('orders.viewReceipt')}</h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <Receipt order={selectedOrder} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('orders.orderTracking')}</h1>
        <p className="text-gray-600">{t('orders.orderTrackingDescription')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">{t('orders.overdueOrders')}</p>
              <p className="text-2xl font-bold text-red-900">
                {orders.filter(order => new Date(order.pickup_date) < new Date() && order.status === 'pending').length}
              </p>
            </div>
            <FiAlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">{t('orders.dueToday')}</p>
              <p className="text-2xl font-bold text-orange-900">
                {orders.filter(order => 
                  new Date(order.pickup_date).toDateString() === new Date().toDateString() && 
                  order.status === 'pending'
                ).length}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">{t('orders.dueTomorrow')}</p>
              <p className="text-2xl font-bold text-yellow-900">
                {orders.filter(order => 
                  new Date(order.pickup_date).toDateString() === new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString() && 
                  order.status === 'pending'
                ).length}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">{t('orders.thisWeek')}</p>
              <p className="text-2xl font-bold text-blue-900">
                {orders.filter(order => {
                  const today = new Date();
                  const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return new Date(order.pickup_date) >= today && 
                         new Date(order.pickup_date) <= weekEnd && 
                         order.status === 'pending';
                }).length}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('orders.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredOrders.length} {filteredOrders.length === 1 ? t('orders.orderFound') : t('orders.ordersFound')}
          </h2>
        </div>
        
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('orders.noOrders')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const priority = getOrderPriority(order);
                const PriorityIcon = getPriorityIcon(priority);
                
                return (
                  <div key={order.id} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${getPriorityColor(priority)}`}>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FiUser className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{order.customer_name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityTextColor(priority)} bg-white`}>
                            <PriorityIcon className="w-3 h-3 mr-1" />
                            {getPriorityText(priority)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{order.customer_phone}</p>
                        <p className="text-sm text-gray-500">Created: {formatDateTime(order.created_at)}</p>
                        <p className={`text-sm font-medium ${priority === 'overdue' ? 'text-red-600' : 'text-gray-600'}`}>
                          Pickup: {formatPickupDate(order.pickup_date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                          {formatOrderStatus(order.status)}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewReceipt(order)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Receipt"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handlePrintReceipt(order)}
                          className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Print Receipt"
                        >
                          <FiPrinter className="w-4 h-4" />
                        </button>
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status === 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'picked_up')}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as Picked Up"
                          >
                            <FiPackage className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {showStatusConfirm && pendingStatusChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FiCheckCircle className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Status Change</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to change the status of order #{pendingStatusChange.orderId} to{' '}
              <span className="font-semibold">{formatOrderStatus(pendingStatusChange.newStatus)}</span>?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowStatusConfirm(false);
                  setPendingStatusChange(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking; 