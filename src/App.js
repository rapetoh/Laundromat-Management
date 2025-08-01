import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import './i18n';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import AddressBook from './pages/AddressBook';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import { formatCurrency } from './utils/formatters';

function AppContent() {
  const { t, i18n } = useTranslation();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    monthlyProfit: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    if (!authLoading) {
      loadDashboardStats();
    }
  }, [authLoading]);

  const loadDashboardStats = async () => {
    try {
      // Check if electronAPI is available
      if (!window.electronAPI) {
        console.log('electronAPI not available, using default stats');
        setStats({
          todayRevenue: 0,
          monthlyRevenue: 0,
          monthlyExpenses: 0,
          monthlyProfit: 0,
          pendingOrders: 0
        });
        setIsLoading(false);
        return;
      }

      const response = await window.electronAPI.getDashboardStats();
      if (response && response.success && response.data) {
        setStats(response.data);
      } else {
        console.error('Invalid dashboard stats response:', response);
        setStats({
          todayRevenue: 0,
          monthlyRevenue: 0,
          monthlyExpenses: 0,
          monthlyProfit: 0,
          pendingOrders: 0
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setStats({
        todayRevenue: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        monthlyProfit: 0,
        pendingOrders: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar stats={stats} onLanguageToggle={toggleLanguage} onLogout={handleLogout} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredPermission="view_dashboard">
                <Dashboard stats={stats} onStatsUpdate={loadDashboardStats} />
              </ProtectedRoute>
            } />
            <Route path="/new-order" element={
              <ProtectedRoute requiredPermission="create_orders">
                <NewOrder onOrderCreated={loadDashboardStats} />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute requiredPermission="view_orders">
                <Orders onOrderUpdated={loadDashboardStats} />
              </ProtectedRoute>
            } />
            <Route path="/order-tracking" element={
              <ProtectedRoute requiredPermission="view_tracking">
                <OrderTracking />
              </ProtectedRoute>
            } />
            <Route path="/address-book" element={
              <ProtectedRoute requiredPermission="view_address_book">
                <AddressBook />
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute requiredPermission="view_expenses">
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredPermission="view_settings">
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App; 