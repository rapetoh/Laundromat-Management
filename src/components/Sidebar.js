import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiPlusCircle, FiList, FiDollarSign, FiSettings, FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiGlobe, FiUsers, FiSearch, FiLogOut, FiUser } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ stats, onLanguageToggle, onLogout, user }) => {
  const { t, i18n } = useTranslation();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', name: t('sidebar.dashboard'), icon: FiHome, permission: 'view_dashboard' },
    { path: '/new-order', name: t('sidebar.newOrder'), icon: FiPlusCircle, permission: 'create_orders' },
    { path: '/orders', name: t('sidebar.orders'), icon: FiList, permission: 'view_orders' },
    { path: '/order-tracking', name: t('sidebar.orderTracking'), icon: FiSearch, permission: 'view_tracking' },
    { path: '/address-book', name: t('sidebar.addressBook'), icon: FiUsers, permission: 'view_address_book' },
    { path: '/expenses', name: t('sidebar.expenses'), icon: FiDollarSign, permission: 'view_expenses' },
    { path: '/settings', name: t('sidebar.settings'), icon: FiSettings, permission: 'view_settings' }
  ];

  const filteredNavItems = navItems.filter(item => hasPermission(item.permission));

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="w-80 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">Pressia</h1>
            <p className="text-sm text-gray-600">{t('sidebar.tagline')}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onLanguageToggle}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiGlobe className="w-4 h-4" />
              <span>{i18n.language.toUpperCase()}</span>
            </button>
          </div>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiUser className="w-4 h-4 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Stats Overview */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('sidebar.todayOverview')}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{t('sidebar.todayRevenue')}</span>
            </div>
            <span className="text-sm font-semibold text-green-700">{formatCurrency(stats.todayRevenue)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiClock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{t('sidebar.pendingOrders')}</span>
            </div>
            <span className="text-sm font-semibold text-blue-700">{stats.pendingOrders}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">{t('sidebar.monthProfit')}</span>
            </div>
            <span className="text-sm font-semibold text-purple-700">{formatCurrency(stats.monthlyProfit)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiTrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">{t('sidebar.monthExpenses')}</span>
            </div>
            <span className="text-sm font-semibold text-red-700">{formatCurrency(stats.monthlyExpenses)}</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 