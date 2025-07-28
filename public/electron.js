const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let db;

// Database initialization
function initializeDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'pressia.db');
  db = new Database(dbPath);
  
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      items TEXT NOT NULL,
      total_amount REAL NOT NULL,
      pickup_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS item_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert default item types if table is empty
  const itemCount = db.prepare('SELECT COUNT(*) as count FROM item_types').get();
  if (itemCount.count === 0) {
    const defaultItems = [
      { name: 'Chemise Homme', price: 500, category: 'Vêtements Homme' },
      { name: 'Pantalon Homme', price: 600, category: 'Vêtements Homme' },
      { name: 'Costume', price: 1200, category: 'Vêtements Homme' },
      { name: 'Robe', price: 800, category: 'Vêtements Femme' },
      { name: 'Jupe', price: 500, category: 'Vêtements Femme' },
      { name: 'Blouse', price: 400, category: 'Vêtements Femme' },
      { name: 'T-shirt', price: 300, category: 'Vêtements Général' },
      { name: 'Jeans', price: 700, category: 'Vêtements Général' },
      { name: 'Drap de lit', price: 800, category: 'Linge de maison' },
      { name: 'Serviette', price: 400, category: 'Linge de maison' },
      { name: 'Nappe', price: 600, category: 'Linge de maison' }
    ];

    const insertItem = db.prepare(`
      INSERT INTO item_types (id, name, price, category) 
      VALUES (?, ?, ?, ?)
    `);

    defaultItems.forEach(item => {
      insertItem.run(
        require('crypto').randomUUID(),
        item.name,
        item.price,
        item.category
      );
    });
  }
}

// Create main window
function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('Preload script path:', preloadPath);
  console.log('Preload script exists:', require('fs').existsSync(preloadPath));
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: preloadPath
    },
    icon: path.join(__dirname, 'icon.png'),
    title: 'Pressia - Gestion de Blanchisserie',
    show: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(() => {
  console.log('Electron app is ready');
  console.log('Initializing database...');
  initializeDatabase();
  console.log('Database initialized');
  console.log('Creating window...');
  createWindow();
  console.log('Window created');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('db-get-orders', async () => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-create-order', async (event, orderData) => {
  try {
    const orderId = require('crypto').randomUUID();
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, customer_name, customer_phone, items, total_amount, pickup_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insertOrder.run(
      orderId,
      orderData.customer_name,
      orderData.customer_phone,
      orderData.items,
      orderData.total_amount,
      orderData.pickup_date
    );
    
    return { success: true, data: { 
      id: orderId,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      items: orderData.items,
      total_amount: orderData.total_amount,
      pickup_date: orderData.pickup_date,
      status: 'pending',
      created_at: new Date().toISOString()
    } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-update-order-status', async (event, { orderId, status }) => {
  try {
    db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(status, orderId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-expenses', async () => {
  try {
    const expenses = db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
    return { success: true, data: expenses };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-create-expense', async (event, expenseData) => {
  try {
    const expenseId = require('crypto').randomUUID();
    const insertExpense = db.prepare(`
      INSERT INTO expenses (id, description, amount, category, date)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertExpense.run(
      expenseId,
      expenseData.description,
      expenseData.amount,
      expenseData.category,
      expenseData.date
    );
    
    return { success: true, data: { id: expenseId } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-update-expense', async (event, expenseId, expenseData) => {
  try {
    const updateExpense = db.prepare(`
      UPDATE expenses 
      SET description = ?, amount = ?, category = ?, date = ?
      WHERE id = ?
    `);
    
    updateExpense.run(
      expenseData.description,
      expenseData.amount,
      expenseData.category,
      expenseData.date,
      expenseId
    );
    
    return { success: true, data: { id: expenseId } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-delete-expense', async (event, expenseId) => {
  try {
    const deleteExpense = db.prepare('DELETE FROM expenses WHERE id = ?');
    deleteExpense.run(expenseId);
    
    return { success: true, data: { id: expenseId } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-item-types', async () => {
  try {
    const items = db.prepare('SELECT * FROM item_types ORDER BY category, name').all();
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-create-item-type', async (event, itemData) => {
  try {
    const itemId = require('crypto').randomUUID();
    const insertItem = db.prepare(`
      INSERT INTO item_types (id, name, price, category)
      VALUES (?, ?, ?, ?)
    `);
    
    insertItem.run(
      itemId,
      itemData.name,
      itemData.price,
      itemData.category
    );
    
    return { success: true, data: { id: itemId } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-dashboard-stats', async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0');
    
    const todayRevenue = db.prepare(`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM orders 
      WHERE DATE(created_at) = ?
    `).get(today);
    
    const monthRevenue = db.prepare(`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM orders 
      WHERE strftime('%Y-%m', created_at) = ?
    `).get(thisMonth);
    
    const monthExpenses = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM expenses 
      WHERE strftime('%Y-%m', date) = ?
    `).get(thisMonth);
    
    const pendingOrders = db.prepare(`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'pending'
    `).get();
    
    return {
      success: true,
      data: {
        todayRevenue: todayRevenue.total,
        monthlyRevenue: monthRevenue.total,
        monthlyExpenses: monthExpenses.total,
        monthlyProfit: monthRevenue.total - monthExpenses.total,
        pendingOrders: pendingOrders.count
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-database', async () => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Exporter la base de données',
      defaultPath: `pressia-backup-${new Date().toISOString().split('T')[0]}.sqlite`,
      filters: [
        { name: 'SQLite Database', extensions: ['sqlite', 'db'] }
      ]
    });
    
    if (!result.canceled) {
      const dbPath = path.join(app.getPath('userData'), 'pressia.db');
      fs.copyFileSync(dbPath, result.filePath);
      return { success: true, path: result.filePath };
    }
    return { success: false, error: 'Export cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('import-database', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Importer la base de données',
      filters: [
        { name: 'SQLite Database', extensions: ['sqlite', 'db'] }
      ],
      properties: ['openFile']
    });
    
    if (!result.canceled) {
      const dbPath = path.join(app.getPath('userData'), 'pressia.db');
      fs.copyFileSync(result.filePaths[0], dbPath);
      
      // Reinitialize database connection
      if (db) db.close();
      initializeDatabase();
      
      return { success: true };
    }
    return { success: false, error: 'Import cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}); 