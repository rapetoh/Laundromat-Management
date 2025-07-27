import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiPlusCircle, FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiDollarSign, FiCalendar, FiUser, FiPackage } from 'react-icons/fi';
import { formatCurrency, formatDateTime, formatOrderStatus, getStatusColor } from '../utils/formatters';
import toast from 'react-hot-toast';

const Dashboard = ({ stats, onStatsUpdate }) => {
  const { t } = useTranslation();
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentOrders();
  }, []);

  const loadRecentOrders = async () => {
    try {
      const response = await window.electronAPI.getOrders();
      if (response && response.success && response.data) {
        const recent = response.data.slice(0, 5); // Get last 5 orders
        setRecentOrders(recent);
      } else {
        console.error('Invalid orders response:', response);
        setRecentOrders([]);
      }
    } catch (error) {
      console.error('Error loading recent orders:', error);
      setRecentOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await window.electronAPI.updateOrderStatus(orderId, newStatus);
      toast.success(t('dashboard.orders.statusUpdated'));
      loadRecentOrders();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status');
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

  const statusOptions = [
    { value: 'completed', label: t('dashboard.orders.markCompleted'), icon: FiCheckCircle },
    { value: 'picked_up', label: t('dashboard.orders.markPickedUp'), icon: FiPackage }
  ];

  const statCards = [
    {
      title: t('dashboard.stats.todayRevenue'),
      value: formatCurrency(stats.todayRevenue),
      icon: FiTrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('dashboard.stats.monthlyRevenue'),
      value: formatCurrency(stats.monthlyRevenue),
      icon: FiDollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('dashboard.stats.monthlyExpenses'),
      value: formatCurrency(stats.monthlyExpenses),
      icon: FiTrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: t('dashboard.stats.pendingOrders'),
      value: stats.pendingOrders,
      icon: FiClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-600">{t('dashboard.welcome')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/new-order"
            className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <FiPlusCircle className="w-6 h-6 text-primary-600" />
            <span className="font-medium text-primary-700">{t('dashboard.actions.newOrder')}</span>
          </Link>
          <Link
            to="/orders"
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FiPackage className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-700">{t('dashboard.actions.viewOrders')}</span>
          </Link>
          <Link
            to="/expenses"
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FiDollarSign className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-700">{t('dashboard.actions.viewExpenses')}</span>
          </Link>
          <Link
            to="/expenses"
            className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <FiTrendingDown className="w-6 h-6 text-yellow-600" />
            <span className="font-medium text-yellow-700">{t('dashboard.actions.addExpense')}</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.recentOrders')}</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('dashboard.orders.noOrders')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FiUser className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{order.customer_name}</h3>
                      <p className="text-sm text-gray-500">{order.customer_phone}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                        {formatOrderStatus(order.status)}
                      </span>
                    </div>
                    {order.status === 'pending' && (
                      <div className="flex space-x-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleStatusUpdate(order.id, option.value)}
                            className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700 transition-colors"
                          >
                            <option.icon className="w-3 h-3" />
                            <span>{option.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 