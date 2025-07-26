import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiDollarSign, 
  FiCalendar, 
  FiTag, 
  FiTrash2,
  FiEdit3,
  FiTrendingDown,
  FiFilter,
  FiX
} from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const Expenses = ({ onExpenseCreated }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const expenseCategories = [
    'Électricité',
    'Eau',
    'Produits de nettoyage',
    'Maintenance',
    'Salaire',
    'Transport',
    'Marketing',
    'Fournitures',
    'Autres'
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, categoryFilter, dateFilter]);

  const loadExpenses = async () => {
    try {
      const result = await window.electronAPI.getExpenses();
      if (result.success) {
        setExpenses(result.data);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Erreur lors du chargement des dépenses');
    } finally {
      setIsLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = expenses;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(expense => expense.date === dateFilter);
    }

    setFilteredExpenses(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error('La description est requise');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Le montant doit être supérieur à 0');
      return;
    }
    
    if (!formData.category) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    try {
      const expenseData = {
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date
      };

      const result = await window.electronAPI.createExpense(expenseData);
      
      if (result.success) {
        toast.success('Dépense ajoutée avec succès');
        loadExpenses();
        onExpenseCreated();
        resetForm();
      } else {
        toast.error('Erreur lors de l\'ajout de la dépense');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Erreur lors de l\'ajout de la dépense');
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date
    });
    setShowForm(true);
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des dépenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dépenses
        </h1>
        <p className="text-gray-600">
          Suivez et gérez vos dépenses d'entreprise
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FiTrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total des dépenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dépenses ce mois</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(expenses.filter(e => {
                  const expenseDate = new Date(e.date);
                  const now = new Date();
                  return expenseDate.getMonth() === now.getMonth() && 
                         expenseDate.getFullYear() === now.getFullYear();
                }).reduce((sum, e) => sum + e.amount, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiTag className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Catégories</p>
              <p className="text-2xl font-bold text-green-600">
                {new Set(expenses.map(e => e.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Toutes les catégories</option>
              {expenseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Ajouter une dépense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingExpense ? 'Modifier la dépense' : 'Ajouter une dépense'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Description de la dépense"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (XOF) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {expenseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingExpense ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des dépenses
          </h2>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <FiDollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune dépense trouvée
            </h3>
            <p className="text-gray-500">
              {categoryFilter !== 'all' || dateFilter 
                ? 'Essayez de modifier vos critères de filtrage'
                : 'Commencez par ajouter votre première dépense'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <FiDollarSign className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {expense.description}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <FiTag className="w-3 h-3 mr-1" />
                            {expense.category}
                          </span>
                          <span className="flex items-center">
                            <FiCalendar className="w-3 h-3 mr-1" />
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </span>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        title="Modifier"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses; 