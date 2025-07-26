import React, { useState, useEffect } from 'react';
import { 
  FiSettings, 
  FiPackage, 
  FiPlus, 
  FiEdit3, 
  FiTrash2,
  FiDownload,
  FiUpload,
  FiSave,
  FiX,
  FiDollarSign,
  FiTag
} from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const Settings = () => {
  const [itemTypes, setItemTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [itemFormData, setItemFormData] = useState({
    name: '',
    price: '',
    category: ''
  });

  const itemCategories = [
    'Vêtements Homme',
    'Vêtements Femme',
    'Vêtements Général',
    'Linge de maison',
    'Autres'
  ];

  useEffect(() => {
    loadItemTypes();
  }, []);

  const loadItemTypes = async () => {
    try {
      const result = await window.electronAPI.getItemTypes();
      if (result.success) {
        setItemTypes(result.data);
      }
    } catch (error) {
      console.error('Error loading item types:', error);
      toast.error('Erreur lors du chargement des types d\'articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemFormData.name.trim()) {
      toast.error('Le nom de l\'article est requis');
      return;
    }
    
    if (!itemFormData.price || parseFloat(itemFormData.price) <= 0) {
      toast.error('Le prix doit être supérieur à 0');
      return;
    }
    
    if (!itemFormData.category) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    try {
      const itemData = {
        name: itemFormData.name.trim(),
        price: parseFloat(itemFormData.price),
        category: itemFormData.category
      };

      const result = await window.electronAPI.createItemType(itemData);
      
      if (result.success) {
        toast.success('Type d\'article ajouté avec succès');
        loadItemTypes();
        resetItemForm();
      } else {
        toast.error('Erreur lors de l\'ajout du type d\'article');
      }
    } catch (error) {
      console.error('Error creating item type:', error);
      toast.error('Erreur lors de l\'ajout du type d\'article');
    }
  };

  const resetItemForm = () => {
    setItemFormData({
      name: '',
      price: '',
      category: ''
    });
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category
    });
    setShowItemForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type d\'article ?')) {
      try {
        // Note: This would require adding a delete endpoint to the electron API
        toast.error('Fonctionnalité de suppression non implémentée');
      } catch (error) {
        console.error('Error deleting item type:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleExportDatabase = async () => {
    setIsExporting(true);
    try {
      const result = await window.electronAPI.exportDatabase();
      if (result.success) {
        toast.success(`Base de données exportée vers: ${result.path}`);
      } else {
        toast.error('Erreur lors de l\'export de la base de données');
      }
    } catch (error) {
      console.error('Error exporting database:', error);
      toast.error('Erreur lors de l\'export de la base de données');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportDatabase = async () => {
    setIsImporting(true);
    try {
      const result = await window.electronAPI.importDatabase();
      if (result.success) {
        toast.success('Base de données importée avec succès');
        // Reload data after import
        loadItemTypes();
      } else {
        toast.error('Erreur lors de l\'import de la base de données');
      }
    } catch (error) {
      console.error('Error importing database:', error);
      toast.error('Erreur lors de l\'import de la base de données');
    } finally {
      setIsImporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Configurez votre système de gestion de blanchisserie
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Item Types Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Types d'articles
              </h2>
              <button
                onClick={() => setShowItemForm(true)}
                className="flex items-center space-x-2 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <FiPlus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Add/Edit Item Form */}
          {showItemForm && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">
                  {editingItem ? 'Modifier l\'article' : 'Ajouter un article'}
                </h3>
                <button
                  onClick={resetItemForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleItemSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'article *
                    </label>
                    <input
                      type="text"
                      value={itemFormData.name}
                      onChange={(e) => setItemFormData({...itemFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: Chemise Homme"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (XOF) *
                    </label>
                    <input
                      type="number"
                      value={itemFormData.price}
                      onChange={(e) => setItemFormData({...itemFormData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="500"
                      min="0"
                      step="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={itemFormData.category}
                    onChange={(e) => setItemFormData({...itemFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {itemCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetItemForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    {editingItem ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Items List */}
          <div className="divide-y divide-gray-200">
            {itemTypes.length === 0 ? (
              <div className="p-6 text-center">
                <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun type d'article configuré</p>
              </div>
            ) : (
              itemTypes.map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiPackage className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FiTag className="w-3 h-3 mr-1" />
                              {item.category}
                            </span>
                            <span className="flex items-center">
                              <FiDollarSign className="w-3 h-3 mr-1" />
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        title="Modifier"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Database Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Gestion de la base de données
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Export Database */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Exporter la base de données
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Sauvegardez vos données dans un fichier local pour les conserver en sécurité.
              </p>
              <button
                onClick={handleExportDatabase}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Export en cours...</span>
                  </>
                ) : (
                  <>
                    <FiDownload className="w-4 h-4" />
                    <span>Exporter</span>
                  </>
                )}
              </button>
            </div>

            {/* Import Database */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Importer la base de données
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Restaurez vos données à partir d'un fichier de sauvegarde.
              </p>
              <button
                onClick={handleImportDatabase}
                disabled={isImporting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Import en cours...</span>
                  </>
                ) : (
                  <>
                    <FiUpload className="w-4 h-4" />
                    <span>Importer</span>
                  </>
                )}
              </button>
            </div>

            {/* System Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Informations système
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Plateforme:</span>
                  <span>{window.electronAPI?.platform || 'Desktop'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Types d'articles:</span>
                  <span>{itemTypes.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 