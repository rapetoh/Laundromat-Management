import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: 'cashier',
    password: 'cashier123',
    role: 'cashier'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simuler une vérification d'authentification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérification simple (en production, ceci devrait être côté serveur)
      const validCredentials = {
        admin: { username: 'admin', password: 'admin123' },
        cashier: { username: 'cashier', password: 'cashier123' }
      };

      const selectedRole = formData.role;
      const validCreds = validCredentials[selectedRole];

      if (formData.username === validCreds.username && formData.password === validCreds.password) {
        // Créer l'objet utilisateur
        const userInfo = {
          username: formData.username,
          role: selectedRole,
          loginTime: new Date().toISOString()
        };
        
        // Utiliser la fonction login du contexte
        login(userInfo);
        
        toast.success(t('login.success'));
        // La redirection se fera automatiquement via le contexte
      } else {
        toast.error(t('login.invalidCredentials'));
      }
    } catch (error) {
      toast.error(t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pressia</h1>
          <p className="text-gray-600">{t('login.tagline')}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.role')}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cashier">{t('login.roles.cashier')}</option>
              <option value="admin">{t('login.roles.admin')}</option>
            </select>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.username')}
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('login.usernamePlaceholder')}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.password')}
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('login.passwordPlaceholder')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{t('login.demoCredentials')}</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Cashier:</strong> cashier / cashier123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 