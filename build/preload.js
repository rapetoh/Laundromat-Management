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
  
  getItemTypes: () => ipcRenderer.invoke('db-get-item-types'),
  createItemType: (itemData) => ipcRenderer.invoke('db-create-item-type', itemData),
  
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