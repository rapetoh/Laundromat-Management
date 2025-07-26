import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiPhone, 
  FiPackage, 
  FiPlus, 
  FiMinus, 
  FiTrash2,
  FiCalendar,
  FiDollarSign,
  FiPrinter,
  FiShare2,
  FiCopy
} from 'react-icons/fi';
import { formatCurrency, getPickupDate, calculateTotal, formatPickupDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import Receipt from '../components/Receipt';

const NewOrder = ({ onOrderCreated }) => {
  const navigate = useNavigate();
  const [itemTypes, setItemTypes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupDate, setPickupDate] = useState(getPickupDate());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

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

  const addItem = (itemType) => {
    const existingItem = selectedItems.find(item => item.id === itemType.id);
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(item =>
        item.id === itemType.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, { ...itemType, quantity: 1 }]);
    }
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setSelectedItems(selectedItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast.error('Le nom du client est requis');
      return;
    }
    
    if (selectedItems.length === 0) {
      toast.error('Veuillez sélectionner au moins un article');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        items: selectedItems,
        totalAmount: calculateTotal(selectedItems),
        pickupDate: pickupDate
      };

      const result = await window.electronAPI.createOrder(orderData);
      
      if (result.success) {
        const order = {
          id: result.data.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          items: selectedItems,
          total_amount: calculateTotal(selectedItems),
          pickup_date: pickupDate,
          created_at: new Date().toISOString()
        };
        
        setCreatedOrder(order);
        setShowReceipt(true);
        onOrderCreated();
        toast.success('Commande créée avec succès');
      } else {
        toast.error('Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCopyReceipt = async () => {
    try {
      const receiptText = `Commande Pressia\n\nClient: ${createdOrder.customer_name}\nTéléphone: ${createdOrder.customer_phone}\nDate de récupération: ${formatPickupDate(createdOrder.pickup_date)}\n\nArticles:\n${createdOrder.items.map(item => `${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`).join('\n')}\n\nTotal: ${formatCurrency(createdOrder.total_amount)}`;
      
      await navigator.clipboard.writeText(receiptText);
      toast.success('Reçu copié dans le presse-papiers');
    } catch (error) {
      toast.error('Erreur lors de la copie du reçu');
    }
  };

  const handleNewOrder = () => {
    setCustomerName('');
    setCustomerPhone('');
    setSelectedItems([]);
    setPickupDate(getPickupDate());
    setShowReceipt(false);
    setCreatedOrder(null);
  };

  const total = calculateTotal(selectedItems);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des types d'articles...</p>
        </div>
      </div>
    );
  }

  if (showReceipt && createdOrder) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Commande créée avec succès !
              </h2>
              <p className="text-gray-600">
                Le reçu a été généré. Vous pouvez l'imprimer ou le partager.
              </p>
            </div>

            <Receipt order={createdOrder} />

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handlePrintReceipt}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiPrinter className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
              
              <button
                onClick={handleCopyReceipt}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                <FiCopy className="w-4 h-4" />
                <span>Copier</span>
              </button>
              
              <button
                onClick={handleNewOrder}
                className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Nouvelle commande</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nouvelle commande
          </h1>
          <p className="text-gray-600">
            Créez une nouvelle commande de blanchisserie
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations du client
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du client *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nom complet du client"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Numéro de téléphone"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Item Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sélection des articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {itemTypes.map((itemType) => (
                <button
                  key={itemType.id}
                  type="button"
                  onClick={() => addItem(itemType)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900">{itemType.name}</div>
                  <div className="text-sm text-gray-500">{itemType.category}</div>
                  <div className="text-lg font-semibold text-primary-600 mt-2">
                    {formatCurrency(itemType.price)}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md font-semibold text-gray-900 mb-4">
                  Articles sélectionnés
                </h3>
                
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(item.price)} × {item.quantity}
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pickup Date */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Date de récupération
            </h2>
            
            <div className="flex items-center space-x-3">
              <FiCalendar className="text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <span className="text-sm text-gray-500">
                (Date suggérée: {formatPickupDate(pickupDate)})
              </span>
            </div>
          </div>

          {/* Total and Submit */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Total de la commande
              </h2>
              <div className="text-3xl font-bold text-primary-600">
                {formatCurrency(total)}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || selectedItems.length === 0}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <FiPackage className="w-4 h-4" />
                    <span>Créer la commande</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder; 