import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    const permissions = {
      admin: [
        'view_dashboard',
        'create_orders',
        'edit_orders',
        'delete_orders',
        'view_orders',
        'view_expenses',
        'create_expenses',
        'edit_expenses',
        'delete_expenses',
        'view_settings',
        'edit_settings',
        'view_address_book',
        'edit_address_book',
        'view_tracking'
      ],
      cashier: [
        'view_dashboard',
        'create_orders',
        'edit_orders',
        'view_orders',
        'view_address_book',
        'edit_address_book',
        'view_tracking'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 