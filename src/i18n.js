import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Sidebar
      dashboard: 'Dashboard',
      newOrder: 'New Order',
      ordersList: 'Orders List',
      priceListSetup: 'Price List Setup',
      // Dashboard
      totalOrders: 'Total Orders',
      pendingOrders: 'Pending Orders',
      readyForPickup: 'Ready for Pickup',
      totalRevenue: 'Total Revenue',
      recentOrders: 'Recent Orders',
      orderId: 'Order ID',
      customerName: 'Customer Name',
      status: 'Status',
      total: 'Total',
      date: 'Date',
      actions: 'Actions',
      viewDetails: 'View Details',
      // New Order
      customerInformation: 'Customer Information',
      phoneNumber: 'Phone Number',
      enterCustomerName: 'Enter customer name',
      phonePlaceholder: 'e.g., +250 788 123 456',
      clothingItems: 'Clothing Items',
      addItem: 'Add Item',
      orderDetails: 'Order Details',
      pickupDate: 'Pickup/Delivery Date',
      totalCost: 'Total Cost',
      confirmOrder: 'Confirm Order & Print Receipt',
      // Orders List
      filterOrders: 'Filter Orders',
      search: 'Search',
      statusAll: 'All Statuses',
      fromDate: 'From Date',
      toDate: 'To Date',
      allOrders: 'All Orders',
      items: 'Items',
      dueDate: 'Due Date',
      // Price List
      priceListSetupTitle: 'Price List Setup',
      addNewItem: 'Add New Item',
      itemName: 'Item Name',
      pricePerUnit: 'Price per Unit',
      add: 'Add',
      clearForm: 'Clear Form',
      currentPriceList: 'Current Price List',
      actionsEdit: 'Edit',
      actionsDelete: 'Delete',
      // General
      light: 'Light',
      dark: 'Dark',
      english: 'EN',
      french: 'FR',
      // Statuses
      pending: 'Pending',
      ready: 'Ready',
      delivered: 'Delivered',
      // ...add more as needed
    }
  },
  fr: {
    translation: {
      dashboard: 'Tableau de bord',
      newOrder: 'Nouvelle commande',
      ordersList: 'Liste des commandes',
      priceListSetup: 'Configuration des prix',
      totalOrders: 'Total des commandes',
      pendingOrders: 'Commandes en attente',
      readyForPickup: 'Prêt pour le ramassage',
      totalRevenue: 'Revenu total',
      recentOrders: 'Commandes récentes',
      orderId: 'ID COMMANDE',
      customerName: 'Nom du client',
      status: 'Statut',
      total: 'Total',
      date: 'Date',
      actions: 'Actions',
      viewDetails: 'Voir les détails',
      customerInformation: 'Informations client',
      phoneNumber: 'Numéro de téléphone',
      enterCustomerName: 'Entrez le nom du client',
      phonePlaceholder: 'ex: +250 788 123 456',
      clothingItems: 'Articles vestimentaires',
      addItem: 'Ajouter un article',
      orderDetails: 'Détails de la commande',
      pickupDate: 'Date de ramassage/livraison',
      totalCost: 'Coût total',
      confirmOrder: 'Confirmer la commande et imprimer le reçu',
      filterOrders: 'Filtrer les commandes',
      search: 'Rechercher',
      statusAll: 'Tous les statuts',
      fromDate: 'Date de début',
      toDate: 'Date de fin',
      allOrders: 'Toutes les commandes',
      items: 'Articles',
      dueDate: 'Date d\'échéance',
      priceListSetupTitle: 'Configuration des prix',
      addNewItem: 'Ajouter un article',
      itemName: 'Nom de l\'article',
      pricePerUnit: 'Prix unitaire',
      add: 'Ajouter',
      clearForm: 'Effacer',
      currentPriceList: 'Liste des prix actuelle',
      actionsEdit: 'Modifier',
      actionsDelete: 'Supprimer',
      light: 'Clair',
      dark: 'Sombre',
      english: 'EN',
      french: 'FR',
      pending: 'En attente',
      ready: 'Prêt',
      delivered: 'Livré',
      // ...add more as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 