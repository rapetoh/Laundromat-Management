import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiPlusCircle, 
  FiList, 
  FiDollarSign, 
  FiSettings,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';

const Sidebar = ({ stats }) => {
  const navItems = [
    {
      path: '/dashboard',
      name: 'Tableau de bord',
      icon: FiHome
    },
    {
      path: '/new-order',
      name: 'Nouvelle commande',
      icon: FiPlusCircle
    },
    {
      path: '/orders',
      name: 'Commandes',
      icon: FiList
    },
    {
      path: '/expenses',
      name: 'Dépenses',
      icon: FiDollarSign
    },
    {
      path: '/settings',
      name: 'Paramètres',
      icon: FiSettings
    }
  ];

  return (
    <div className="w-80 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pressia</h1>
            <p className="text-sm text-gray-500">Gestion de Blanchisserie</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Stats Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Aperçu du jour</h3>
        
        <div className="space-y-3">
          {/* Today's Revenue */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Revenus du jour</span>
            </div>
            <span className="text-sm font-semibold text-green-700">
              {formatCurrency(stats.todayRevenue)}
            </span>
          </div>

          {/* Pending Orders */}
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiClock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-600">Commandes en attente</span>
            </div>
            <span className="text-sm font-semibold text-yellow-700">
              {stats.pendingOrders}
            </span>
          </div>

          {/* Monthly Profit */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Bénéfice du mois</span>
            </div>
            <span className={`text-sm font-semibold ${
              stats.monthProfit >= 0 ? 'text-blue-700' : 'text-red-700'
            }`}>
              {formatCurrency(stats.monthProfit)}
            </span>
          </div>

          {/* Monthly Expenses */}
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiTrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-600">Dépenses du mois</span>
            </div>
            <span className="text-sm font-semibold text-red-700">
              {formatCurrency(stats.monthExpenses)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Version 1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2024 Pressia
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 