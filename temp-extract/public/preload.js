const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is loading...');

// Test if we can access electron modules
console.log('contextBridge available:', !!contextBridge);
console.log('ipcRenderer available:', !!ipcRenderer);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  getOrders: () => {
    console.log('getOrders called from renderer');
    return ipcRenderer.invoke('db-get-orders');
  },
  createOrder: (orderData) => {
    console.log('createOrder called from renderer');
    return ipcRenderer.invoke('db-create-order', orderData);
  },
  updateOrderStatus: (orderId, status) => {
    console.log('updateOrderStatus called from renderer');
    return ipcRenderer.invoke('db-update-order-status', { orderId, status });
  },
  
  getExpenses: () => {
    console.log('getExpenses called from renderer');
    return ipcRenderer.invoke('db-get-expenses');
  },
  createExpense: (expenseData) => {
    console.log('createExpense called from renderer');
    return ipcRenderer.invoke('db-create-expense', expenseData);
  },
  updateExpense: (expenseId, expenseData) => {
    console.log('updateExpense called from renderer');
    return ipcRenderer.invoke('db-update-expense', expenseId, expenseData);
  },
  deleteExpense: (expenseId) => {
    console.log('deleteExpense called from renderer');
    return ipcRenderer.invoke('db-delete-expense', expenseId);
  },
  
  getItemTypes: () => {
    console.log('getItemTypes called from renderer');
    return ipcRenderer.invoke('db-get-item-types');
  },
  createItemType: (itemData) => {
    console.log('createItemType called from renderer');
    return ipcRenderer.invoke('db-create-item-type', itemData);
  },
  updateItemType: (itemId, itemData) => {
    console.log('updateItemType called from renderer');
    return ipcRenderer.invoke('db-update-item-type', itemId, itemData);
  },
  deleteItemType: (itemId) => {
    console.log('deleteItemType called from renderer');
    return ipcRenderer.invoke('db-delete-item-type', itemId);
  },
  
  // Customer operations
  getCustomers: () => {
    console.log('getCustomers called from renderer');
    return ipcRenderer.invoke('db-get-customers');
  },
  createCustomer: (customerData) => {
    console.log('createCustomer called from renderer');
    return ipcRenderer.invoke('db-create-customer', customerData);
  },
  updateCustomer: (customerId, customerData) => {
    console.log('updateCustomer called from renderer');
    return ipcRenderer.invoke('db-update-customer', customerId, customerData);
  },
  deleteCustomer: (customerId) => {
    console.log('deleteCustomer called from renderer');
    return ipcRenderer.invoke('db-delete-customer', customerId);
  },
  searchCustomers: (searchTerm) => {
    console.log('searchCustomers called from renderer');
    return ipcRenderer.invoke('db-search-customers', searchTerm);
  },
  
  getDashboardStats: () => {
    console.log('getDashboardStats called from renderer');
    return ipcRenderer.invoke('db-get-dashboard-stats');
  },
  
  // File operations
  exportDatabase: () => {
    console.log('exportDatabase called from renderer');
    return ipcRenderer.invoke('export-database');
  },
  importDatabase: () => {
    console.log('importDatabase called from renderer');
    return ipcRenderer.invoke('import-database');
  },
  
  // Platform info
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development',
  
  // Test method
  test: () => {
    console.log('test method called from renderer');
    return 'preload script is working!';
  }
});

console.log('electronAPI exposed to renderer process');
console.log('Available methods:', Object.keys(contextBridge.exposeInMainWorld)); 