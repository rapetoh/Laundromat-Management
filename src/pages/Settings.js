import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSettings, FiPackage, FiPlus, FiEdit3, FiTrash2, FiDownload, FiUpload, FiSave, FiX, FiDollarSign, FiTag } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const Settings = () => {
  const { t } = useTranslation();
  const [itemTypes, setItemTypes] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: '',
    price: ''
  });

  const itemCategories = [
    { value: 'mensClothing', label: t('categories.mensClothing') },
    { value: 'womensClothing', label: t('categories.womensClothing') },
    { value: 'childrensClothing', label: t('categories.childrensClothing') },
    { value: 'bedding', label: t('categories.bedding') },
    { value: 'curtains', label: t('categories.curtains') },
    { value: 'other', label: t('categories.other') }
  ];

  useEffect(() => {
    loadItemTypes();
  }, []);

  const loadItemTypes = async () => {
    try {
      const response = await window.electronAPI.getItemTypes();
      if (response && response.success && response.data) {
        setItemTypes(response.data);
      } else {
        console.error('Invalid item types response:', response);
        setItemTypes([]);
      }
    } catch (error) {
      console.error('Error loading item types:', error);
      toast.error('Error loading item types');
      setItemTypes([]);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemFormData.name || !itemFormData.category || !itemFormData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const itemData = {
        name: itemFormData.name.trim(),
        category: itemFormData.category,
        price: parseFloat(itemFormData.price)
      };

      if (editingItem) {
        // Update existing item
        await window.electronAPI.updateItemType(editingItem.id, itemData);
        toast.success(t('settings.itemUpdated'));
      } else {
        // Create new item
        await window.electronAPI.createItemType(itemData);
        toast.success(t('settings.itemAdded'));
      }
      
      resetItemForm();
      loadItemTypes();
    } catch (error) {
      console.error('Error saving item type:', error);
      toast.error(editingItem ? 'Error updating item type' : 'Error creating item type');
    }
  };

  const resetItemForm = () => {
    setItemFormData({
      name: '',
      category: '',
      price: ''
    });
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString()
    });
    setShowItemForm(true);
    
    // Auto-scroll to the form after a short delay to ensure it's rendered
    setTimeout(() => {
      const formElement = document.querySelector('.item-form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item type?')) {
      try {
        await window.electronAPI.deleteItemType(itemId);
        toast.success(t('settings.itemDeleted'));
        loadItemTypes();
      } catch (error) {
        console.error('Error deleting item type:', error);
        toast.error('Error deleting item type');
      }
    }
  };

  const handleExportDatabase = async () => {
    setIsExporting(true);
    try {
      await window.electronAPI.exportDatabase();
      toast.success(t('settings.exportSuccess'));
    } catch (error) {
      console.error('Error exporting database:', error);
      toast.error('Error exporting database');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportDatabase = async () => {
    setIsImporting(true);
    try {
      await window.electronAPI.importDatabase();
      toast.success(t('settings.importSuccess'));
      loadItemTypes(); // Reload data after import
    } catch (error) {
      console.error('Error importing database:', error);
      toast.error('Error importing database');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('settings.title')}</h1>
        <p className="text-gray-600">Manage system settings and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Item Types Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">{t('settings.itemTypes')}</h2>
              <button
                onClick={() => setShowItemForm(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>{t('settings.addItemType')}</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {itemTypes.length === 0 ? (
              <div className="text-center py-8">
                <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No item types found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {itemTypes.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FiPackage className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {itemCategories.find(cat => cat.value === item.category)?.label || item.category}
                        </p>
                        <p className="text-sm font-semibold text-primary-600">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit item type"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete item type"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Item Form */}
          {showItemForm && (
            <div className="p-6 border-t border-gray-200 item-form-container">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? t('settings.editItemType') : t('settings.addItemType')}
                </h3>
                <button
                  onClick={resetItemForm}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleItemSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiPackage className="inline w-4 h-4 mr-2" />
                    {t('settings.name')} *
                  </label>
                  <input
                    type="text"
                    value={itemFormData.name}
                    onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiTag className="inline w-4 h-4 mr-2" />
                    {t('settings.category')} *
                  </label>
                  <select
                    value={itemFormData.category}
                    onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select category</option>
                    {itemCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="inline w-4 h-4 mr-2" />
                    {t('settings.price')} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemFormData.price}
                    onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetItemForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('settings.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{t('settings.save')}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Database Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{t('settings.database')}</h2>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('settings.exportDatabase')}</h3>
              <p className="text-sm text-gray-600 mb-4">Export your database to a backup file</p>
              <button
                onClick={handleExportDatabase}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : t('settings.exportDatabase')}</span>
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('settings.importDatabase')}</h3>
              <p className="text-sm text-gray-600 mb-4">Import a database backup file</p>
              <button
                onClick={handleImportDatabase}
                disabled={isImporting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <FiUpload className="w-4 h-4" />
                <span>{isImporting ? 'Importing...' : t('settings.importDatabase')}</span>
              </button>
            </div>
          </div>

          {/* System Information */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('settings.systemInfo')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('settings.version')}:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('settings.platform')}:</span>
                <span className="font-medium">{window.electronAPI?.platform || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('settings.offlineMode')}:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 