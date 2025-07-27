# Pressia Laundry Management

**Offline-First Laundry Management System**

A complete desktop application for laundry and pressing businesses to manage orders, track expenses, and analyze profits.

## Quick Start

### For Testing:
1. **Install Node.js** from https://nodejs.org/ (download LTS version)
2. **Double-click** `START_APP.bat`
3. **Wait for the desktop app to open**
4. **Test all features!**

### Manual Start:
```bash
npm install
npm run electron-dev
```

## Features

### ✅ Core Features:
- **Order Management** - Create and track laundry orders
- **Receipt Generation** - Print or copy receipts
- **Expense Tracking** - Monitor business expenses
- **Dashboard** - View revenue and profit statistics
- **Order Tracking** - Track due dates and status updates

### ✅ Enhanced Features:
- **Order Alerts** - Overdue and urgent order notifications
- **Language Support** - Switch between English and French
- **Data Export/Import** - Backup and restore data
- **Item Management** - Add/edit laundry item types

## System Requirements

- **Windows 10/11**
- **Node.js 16+**
- **4GB RAM** minimum
- **500MB** free disk space

## Data Storage

- All data is stored locally on your computer
- Database file: `%APPDATA%/pressia/pressia.db`
- No internet connection required

## Troubleshooting

### If the app doesn't start:
1. Make sure Node.js is installed
2. Try running `npm install` manually
3. Check if any antivirus is blocking the app

### If you see errors:
1. Close the app completely
2. Delete the `node_modules` folder
3. Run `npm install` again
4. Try `npm run electron-dev`

## Technology Stack

- **Frontend**: React + TailwindCSS
- **Desktop Runtime**: Electron.js
- **Database**: SQLite (local file-based)
- **PDF Generation**: jsPDF
- **Internationalization**: i18next

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run electron-dev

# Build for production
npm run build

# Package for distribution
npm run electron-pack
```

---

**Pressia Laundry Management v1.0.0**
*Built for laundry businesses in French-speaking Africa* 