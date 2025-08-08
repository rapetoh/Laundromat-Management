import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiPhone, FiPackage, FiPlus, FiMinus, FiTrash2, FiCalendar, FiDollarSign, FiPrinter, FiShare2, FiCopy } from 'react-icons/fi';
import { formatCurrency, getPickupDate, calculateTotal, formatPickupDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import Receipt from '../components/Receipt';

const NewOrder = ({ onOrderCreated }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [itemTypes, setItemTypes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupDate, setPickupDate] = useState(getPickupDate());
  const [showReceipt, setShowReceipt] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    console.log('NewOrder component mounted');
    console.log('window.electronAPI available:', !!window.electronAPI);
    if (window.electronAPI) {
      console.log('electronAPI methods:', Object.keys(window.electronAPI));
      // Test if the API is working
      if (window.electronAPI.test) {   
        console.log('Test result:', window.electronAPI.test());
      }
    }
    loadItemTypes();
    loadCustomers();
  }, []);

  // Close customer suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.customer-suggestions')) {
        setShowCustomerSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadItemTypes = async () => {
    try {
      console.log('Loading item types...');
      const types = await window.electronAPI.getItemTypes();
      console.log('Item types response:', types);
      
      if (types && types.success && types.data) {
        setItemTypes(types.data);
        console.log('Item types loaded:', types.data.length, 'items');
      } else {
        console.error('Invalid response format:', types);
        toast.error('Error loading item types: Invalid response');
      }
    } catch (error) {
      console.error('Error loading item types:', error);
      toast.error('Error loading item types: ' + error.message);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await window.electronAPI.getCustomers();
      if (response && response.success && response.data) {
        setCustomers(response.data);
      } else {
        console.error('Invalid customers response:', response);
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    }
  };

  const handleCustomerNameChange = (value) => {
    setCustomerName(value);
    
    if (value.trim()) {
      const filtered = customers.filter(customer =>
        customer.first_name.toLowerCase().includes(value.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(value.toLowerCase()) ||
        `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowCustomerSuggestions(filtered.length > 0);
    } else {
      setFilteredCustomers([]);
      setShowCustomerSuggestions(false);
    }
  };

  const selectCustomer = (customer) => {
    setCustomerName(`${customer.first_name} ${customer.last_name}`);
    setCustomerPhone(customer.phone);
    setShowCustomerSuggestions(false);
    setFilteredCustomers([]);
  };

  const addItem = (itemType) => {
    console.log('Adding item:', itemType);
    const existingItem = selectedItems.find(item => item.id === itemType.id);
    if (existingItem) {
      console.log('Updating existing item quantity');
      setSelectedItems(selectedItems.map(item =>
        item.id === itemType.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      console.log('Adding new item to selection');
      setSelectedItems([...selectedItems, { ...itemType, quantity: 1 }]);
    }
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      setSelectedItems(selectedItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (!customerPhone.trim()) {
      toast.error('Please enter customer phone');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      // Check if customer already exists, if not, add them to Address Book
      const existingCustomer = customers.find(customer =>
        customer.phone === customerPhone.trim() ||
        (customer.first_name + ' ' + customer.last_name).toLowerCase() === customerName.toLowerCase().trim()
      );

      if (!existingCustomer) {
        // Add new customer to Address Book
        const nameParts = customerName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || firstName;
        
        const customerData = {
          first_name: firstName,
          last_name: lastName,
          phone: customerPhone.trim()
        };

        try {
          const customerResponse = await window.electronAPI.createCustomer(customerData);
          if (customerResponse && customerResponse.success) {
            console.log('New customer added to Address Book');
            await loadCustomers(); // Reload customers list
          } else {
            console.error('Error adding customer to Address Book:', customerResponse);
          }
        } catch (error) {
          console.error('Error adding customer to Address Book:', error);
          // Continue with order creation even if customer addition fails
        }
      }

      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        items: JSON.stringify(selectedItems),
        total_amount: calculateTotal(selectedItems),
        pickup_date: pickupDate,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const response = await window.electronAPI.createOrder(orderData);
      if (response && response.success && response.data) {
        setCreatedOrder(response.data);
        setShowReceipt(true);
        onOrderCreated();
        toast.success(t('newOrder.orderCreated'));
      } else {
        console.error('Invalid order creation response:', response);
        toast.error('Error creating order: Invalid response');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order');
    }
  };

  const handlePrintReceipt = () => {
    // Ensure the receipt is visible before printing
    setTimeout(() => {
      // Try to print the receipt specifically
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Pressia Receipt</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 20px; 
                  background: white; 
                }
                .receipt { 
                  max-width: 400px; 
                  margin: 0 auto; 
                  border: 1px solid #ccc; 
                  padding: 20px; 
                }
                .header { text-align: center; margin-bottom: 20px; }
                .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <div class="header">
                  <h1>Pressia - Laundry Receipt</h1>
                </div>
                <p><strong>Order:</strong> #${createdOrder.id}</p>
                <p><strong>Customer:</strong> ${createdOrder.customer_name}</p>
                <p><strong>Phone:</strong> ${createdOrder.customer_phone}</p>
                <p><strong>Pickup Date:</strong> ${formatPickupDate(createdOrder.pickup_date)}</p>
                <p><strong>Total:</strong> ${formatCurrency(createdOrder.total_amount)}</p>
                <div class="total">
                  Thank you for choosing Pressia!
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      } else {
        // Fallback to regular print
        window.print();
      }
    }, 100);
  };

  const handleCopyReceipt = () => {
    // Copy receipt text to clipboard
    const receiptText = `Pressia - Laundry Receipt\nOrder: ${createdOrder.id}\nCustomer: ${createdOrder.customer_name}\nPhone: ${createdOrder.customer_phone}\nTotal: ${formatCurrency(createdOrder.total_amount)}\nPickup: ${formatPickupDate(createdOrder.pickup_date)}`;
    navigator.clipboard.writeText(receiptText);
    toast.success('Receipt copied to clipboard');
  };

  const handleNewOrder = () => {
    setShowReceipt(false);
    setCreatedOrder(null);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedItems([]);
    setPickupDate(getPickupDate());
  };

  if (showReceipt && createdOrder) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-2">{t('newOrder.orderCreated')}</h2>
              <p className="text-gray-600">{t('newOrder.printReceipt')}</p>
            </div>
            
            <Receipt order={createdOrder} />
            
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handlePrintReceipt}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiPrinter className="w-4 h-4" />
                <span>{t('newOrder.printReceipt')}</span>
              </button>
              
              <button
                onClick={handleCopyReceipt}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                <FiCopy className="w-4 h-4" />
                <span>{t('newOrder.copyReceipt')}</span>
              </button>
              
              <button
                onClick={handleNewOrder}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>{t('newOrder.newOrder')}</span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('newOrder.title')}</h1>
          <p className="text-gray-600">{t('newOrder.customerInfo')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('newOrder.customerInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline w-4 h-4 mr-2" />
                  {t('newOrder.customerName')}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => handleCustomerNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter customer name"
                />
                {showCustomerSuggestions && filteredCustomers.length > 0 && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm max-h-60 overflow-y-auto customer-suggestions">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => selectCustomer(customer)}
                      >
                        {customer.first_name} {customer.last_name} ({customer.phone})
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiPhone className="inline w-4 h-4 mr-2" />
                  {t('newOrder.customerPhone')}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-2" />
                  {t('newOrder.pickupDate')}
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Items Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('newOrder.items')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {itemTypes.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 mb-2">Loading item types...</p>
                  <p className="text-sm text-gray-400">If this doesn't load, check the console for errors</p>
                </div>
              ) : (
                itemTypes.map((itemType) => (
                  <button
                    key={itemType.id}
                    type="button"
                    onClick={() => addItem(itemType)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{itemType.name}</h3>
                      <p className="text-sm text-gray-500">{itemType.category}</p>
                      <p className="text-sm font-semibold text-primary-600">{formatCurrency(itemType.price)}</p>
                    </div>
                    <FiPlus className="w-5 h-5 text-primary-600" />
                  </button>
                ))
              )}
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Items</h3>
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-sm font-semibold text-primary-600">{formatCurrency(item.price)} each</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">{t('newOrder.total')}</span>
                    <span className="text-2xl font-bold text-primary-600">{formatCurrency(calculateTotal(selectedItems))}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiDollarSign className="w-5 h-5" />
              <span className="font-medium">{t('newOrder.createOrder')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder; 