import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiDollarSign, FiCalendar, FiTag, FiTrash2, FiEdit3, FiTrendingDown, FiFilter, FiX } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const Expenses = ({ onExpenseCreated }) => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  });

  const expenseCategories = [
    { value: 'electricity', label: t('expenses.categories.electricity') },
    { value: 'water', label: t('expenses.categories.water') },
    { value: 'rent', label: t('expenses.categories.rent') },
    { value: 'salary', label: t('expenses.categories.salary') },
    { value: 'maintenance', label: t('expenses.categories.maintenance') },
    { value: 'supplies', label: t('expenses.categories.supplies') },
    { value: 'other', label: t('expenses.categories.other') }
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, categoryFilter, dateFilter]);

  const loadExpenses = async () => {
    try {
      const response = await window.electronAPI.getExpenses();
      if (response && response.success && response.data) {
        setExpenses(response.data);
      } else {
        console.error('Invalid expenses response:', response);
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Error loading expenses');
      setExpenses([]);
    }
  };

  const filterExpenses = () => {
    let filtered = expenses;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(expense => expense.date === dateFilter);
    }

    setFilteredExpenses(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const expenseData = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description || ''
      };

      if (editingExpense) {
        // Update existing expense
        await window.electronAPI.updateExpense(editingExpense.id, expenseData);
        toast.success(t('expenses.expenseUpdated'));
      } else {
        // Create new expense
        await window.electronAPI.createExpense(expenseData);
        toast.success(t('expenses.expenseAdded'));
      }
      
      resetForm();
      loadExpenses();
      onExpenseCreated();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Error saving expense');
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      date: '',
      description: ''
    });
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    console.log('Editing expense:', expense);
    setEditingExpense(expense);
    const newFormData = {
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      description: expense.description || ''
    };
    console.log('Setting form data:', newFormData);
    setFormData(newFormData);
    setShowForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await window.electronAPI.deleteExpense(expenseId);
        toast.success(t('expenses.expenseDeleted'));
        loadExpenses();
        onExpenseCreated();
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Error deleting expense');
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('expenses.title')}</h1>
        <p className="text-gray-600">Track and manage business expenses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('expenses.totalExpenses')}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('expenses.monthlyExpenses')}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyExpenses)}</p>
            </div>
            <FiTrendingDown className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{expenseCategories.length}</p>
            </div>
            <FiTag className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters and Add Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Categories</option>
                {expenseCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>{t('expenses.addExpense')}</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingExpense ? t('expenses.editExpense') : t('expenses.addExpense')}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {console.log('Current formData:', formData)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiTag className="inline w-4 h-4 mr-2" />
                  {t('expenses.category')} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    console.log('Category changed to:', e.target.value);
                    setFormData({ ...formData, category: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiDollarSign className="inline w-4 h-4 mr-2" />
                  {t('expenses.amount')} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => {
                    console.log('Amount changed to:', e.target.value);
                    setFormData({ ...formData, amount: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-2" />
                  {t('expenses.date')} *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('expenses.description')}
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Optional description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('expenses.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t('expenses.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'Expense' : 'Expenses'} Found
          </h2>
        </div>
        
        <div className="p-6">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-8">
              <FiDollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No expenses found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FiDollarSign className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {expenseCategories.find(cat => cat.value === expense.category)?.label || expense.category}
                      </h3>
                      {expense.description && (
                        <p className="text-sm text-gray-500">{expense.description}</p>
                      )}
                      <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatCurrency(expense.amount)}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit expense"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete expense"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses; 