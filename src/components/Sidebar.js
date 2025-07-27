import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiPlusCircle, FiList, FiDollarSign, FiSettings, FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiGlobe } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';

const Sidebar = ({ stats, onLanguageToggle }) => {
  const { t, i18n } = useTranslation();

  const navItems = [
    { path: '/dashboard', name: t('sidebar.dashboard'), icon: FiHome },
    { path: '/new-order', name: t('sidebar.newOrder'), icon: FiPlusCircle },
    { path: '/orders', name: t('sidebar.orders'), icon: FiList },
    { path: '/order-tracking', name: t('sidebar.orderTracking'), icon: FiClock },
    { path: '/expenses', name: t('sidebar.expenses'), icon: FiDollarSign },
    { path: '/settings', name: t('sidebar.settings'), icon: FiSettings }
  ];

  return (
    <div className="w-80 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">Pressia</h1>
            <p className="text-sm text-gray-600">{t('sidebar.tagline')}</p>
          </div>
          <button
            onClick={onLanguageToggle}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiGlobe className="w-4 h-4" />
            <span>{i18n.language.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">{t('sidebar.version')} 1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">{t('sidebar.offlineMode')}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 