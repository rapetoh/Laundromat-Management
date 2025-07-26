import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Format currency for West African CFA Franc (XOF)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date in French
export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

// Format date and time in French
export const formatDateTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    return dateString;
  }
};

// Get pickup date (3 days from today)
export const getPickupDate = () => {
  const today = new Date();
  const pickupDate = new Date(today);
  pickupDate.setDate(today.getDate() + 3);
  return format(pickupDate, 'yyyy-MM-dd');
};

// Format pickup date for display
export const formatPickupDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

// Format order status
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'En attente',
    completed: 'Terminé',
    picked_up: 'Récupéré',
    cancelled: 'Annulé'
  };
  return statusMap[status] || status;
};

// Get status color
export const getStatusColor = (status) => {
  const colorMap = {
    pending: 'warning',
    completed: 'success',
    picked_up: 'primary',
    cancelled: 'danger'
  };
  return colorMap[status] || 'secondary';
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Togo phone numbers
  if (cleaned.startsWith('228')) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
  }
  
  // Format for local numbers
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

// Calculate total from items
export const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Generate order number
export const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CMD${year}${month}${day}${random}`;
}; 