const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is loading...');

// Test if we can access electron modules
console.log('contextBridge available:', !!contextBridge);
console.log('ipcRenderer available:', !!ipcRenderer);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  getOrders: () => ipcRenderer.invoke('db-get-orders'),
  createOrder: (orderData) => ipcRenderer.invoke('db-create-order', orderData),
  updateOrderStatus: (orderId, status) => ipcRenderer.invoke('db-update-order-status', { orderId, status }),
  
  getExpenses: () => ipcRenderer.invoke('db-get-expenses'),
  createExpense: (expenseData) => ipcRenderer.invoke('db-create-expense', expenseData),
  updateExpense: (expenseId, expenseData) => ipcRenderer.invoke('db-update-expense', expenseId, expenseData),
  deleteExpense: (expenseId) => ipcRenderer.invoke('db-delete-expense', expenseId),
  
  getItemTypes: () => ipcRenderer.invoke('db-get-item-types'),
  createItemType: (itemData) => ipcRenderer.invoke('db-create-item-type', itemData),
  updateItemType: (itemId, itemData) => ipcRenderer.invoke('db-update-item-type', itemId, itemData),
  deleteItemType: (itemId) => ipcRenderer.invoke('db-delete-item-type', itemId),
  
  // Customer operations
  getCustomers: () => ipcRenderer.invoke('db-get-customers'),
  createCustomer: (customerData) => ipcRenderer.invoke('db-create-customer', customerData),
  updateCustomer: (customerId, customerData) => ipcRenderer.invoke('db-update-customer', customerId, customerData),
  deleteCustomer: (customerId) => ipcRenderer.invoke('db-delete-customer', customerId),
  searchCustomers: (searchTerm) => ipcRenderer.invoke('db-search-customers', searchTerm),
  
  getDashboardStats: () => ipcRenderer.invoke('db-get-dashboard-stats'),
  
  // File operations
  exportDatabase: () => ipcRenderer.invoke('export-database'),
  importDatabase: () => ipcRenderer.invoke('import-database'),
  
  // Platform info
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development',
  
  // Test method
  test: () => 'preload script is working!'
});

console.log('electronAPI exposed to renderer process'); 