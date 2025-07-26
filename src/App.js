import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import { formatCurrency } from './utils/formatters';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    monthRevenue: 0,
    monthExpenses: 0,
    monthProfit: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const result = await window.electronAPI.getDashboardStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de Pressia...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar stats={stats} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard stats={stats} onStatsUpdate={loadDashboardStats} />} />
              <Route path="/new-order" element={<NewOrder onOrderCreated={loadDashboardStats} />} />
              <Route path="/orders" element={<Orders onOrderUpdated={loadDashboardStats} />} />
              <Route path="/expenses" element={<Expenses onExpenseCreated={loadDashboardStats} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App; 