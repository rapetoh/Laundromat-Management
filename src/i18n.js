import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // General
      loading: 'Loading Pressia...',
      
      // Sidebar
      sidebar: {
        dashboard: 'Dashboard',
        newOrder: 'New Order',
        orders: 'Orders',
        orderTracking: 'Order Tracking',
        addressBook: 'Address Book',
        expenses: 'Expenses',
        settings: 'Settings',
        tagline: 'Laundry Management',
        todayOverview: "Today's Overview",
        todayRevenue: 'Today Revenue',
        pendingOrders: 'Pending Orders',
        monthProfit: 'Month Profit',
        monthExpenses: 'Month Expenses',
        version: 'Version',
        offlineMode: 'Offline Mode'
      },

      // Dashboard
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome to Pressia',
        quickActions: 'Quick Actions',
        recentOrders: 'Recent Orders',
        stats: {
          todayRevenue: 'Today Revenue',
          monthlyRevenue: 'Monthly Revenue',
          monthlyExpenses: 'Monthly Expenses',
          monthlyProfit: 'Monthly Profit',
          pendingOrders: 'Pending Orders',
          completedOrders: 'Completed Orders'
        },
        actions: {
          newOrder: 'Create New Order',
          viewOrders: 'View All Orders',
          addExpense: 'Add Expense',
          viewExpenses: 'View Expenses'
        },
        orders: {
          noOrders: 'No recent orders',
          customer: 'Customer',
          total: 'Total',
          date: 'Date',
          status: 'Status',
          markCompleted: 'Mark as Completed',
          markPickedUp: 'Mark as Picked Up'
        }
      },

      // New Order
      newOrder: {
        title: 'New Order',
        customerInfo: 'Customer Information',
        customerName: 'Customer Name',
        customerPhone: 'Phone Number',
        pickupDate: 'Pickup Date',
        items: 'Items',
        addItem: 'Add Item',
        removeItem: 'Remove',
        quantity: 'Quantity',
        total: 'Total',
        createOrder: 'Create Order',
        orderCreated: 'Order created successfully!',
        printReceipt: 'Print Receipt',
        copyReceipt: 'Copy Receipt',
        newOrder: 'New Order'
      },

      // Orders
      orders: {
        title: 'Orders',
        search: 'Search orders...',
        filterByStatus: 'Filter by status',
        all: 'All',
        pending: 'Pending',
        completed: 'Completed',
        pickedUp: 'Picked Up',
        cancelled: 'Cancelled',
        noOrders: 'No orders found',
        viewReceipt: 'View Receipt',
        updateStatus: 'Update Status',
        statusUpdated: 'Status updated successfully!'
      },

      // Expenses
      expenses: {
        title: 'Expenses',
        addExpense: 'Add Expense',
        editExpense: 'Edit Expense',
        category: 'Category',
        amount: 'Amount',
        date: 'Date',
        description: 'Description',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        totalExpenses: 'Total Expenses',
        monthlyExpenses: 'Monthly Expenses',
        expenseAdded: 'Expense added successfully!',
        expenseUpdated: 'Expense updated successfully!',
        expenseDeleted: 'Expense deleted successfully!',
        categories: {
          electricity: 'Electricity',
          water: 'Water',
          rent: 'Rent',
          salary: 'Salary',
          maintenance: 'Maintenance',
          supplies: 'Supplies',
          other: 'Other'
        }
      },

      // Address Book
      addressBook: {
        title: 'Address Book',
        subtitle: 'Manage your customer contacts',
        addCustomer: 'Add Customer',
        editCustomer: 'Edit Customer',
        deleteCustomer: 'Delete Customer',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone',
        firstNamePlaceholder: 'Enter first name',
        lastNamePlaceholder: 'Enter last name',
        phonePlaceholder: 'Enter phone number',
        searchPlaceholder: 'Search customers...',
        save: 'Save',
        cancel: 'Cancel',
        noCustomers: 'No customers found',
        noSearchResults: 'No customers match your search',
        customerAdded: 'Customer added successfully!',
        customerUpdated: 'Customer updated successfully!',
        customerDeleted: 'Customer deleted successfully!',
        confirmDelete: 'Are you sure you want to delete this customer?',
        fillRequiredFields: 'Please fill in all required fields',
        errorLoading: 'Error loading customers',
        errorCreating: 'Error creating customer',
        errorUpdating: 'Error updating customer',
        errorDeleting: 'Error deleting customer'
      },

      // Settings
      settings: {
        title: 'Settings',
        itemTypes: 'Item Types',
        addItemType: 'Add Item Type',
        editItemType: 'Edit Item Type',
        name: 'Name',
        category: 'Category',
        price: 'Price',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        itemAdded: 'Item type added successfully!',
        itemUpdated: 'Item type updated successfully!',
        itemDeleted: 'Item type deleted successfully!',
        database: 'Database',
        exportDatabase: 'Export Database',
        importDatabase: 'Import Database',
        exportSuccess: 'Database exported successfully!',
        importSuccess: 'Database imported successfully!',
        systemInfo: 'System Information',
        version: 'Version',
        platform: 'Platform',
        offlineMode: 'Offline Mode'
      },

      // Receipt
      receipt: {
        title: 'Pressia - Laundry Receipt',
        orderNumber: 'Order Number',
        date: 'Date',
        customer: 'Customer',
        phone: 'Phone',
        items: 'Items',
        pickupDate: 'Pickup Date',
        total: 'Total',
        thankYou: 'Thank you for choosing Pressia!',
        printInstructions: 'Press Ctrl+P to print this receipt'
      },

      // Status
      status: {
        pending: 'Pending',
        completed: 'Completed',
        pickedUp: 'Picked Up',
        cancelled: 'Cancelled'
      },

      // Categories
      categories: {
        mensClothing: "Men's Clothing",
        womensClothing: "Women's Clothing",
        childrensClothing: "Children's Clothing",
        bedding: 'Bedding',
        curtains: 'Curtains',
        other: 'Other'
      }
    }
  },
  fr: {
    translation: {
      // General
      loading: 'Chargement de Pressia...',
      
      // Sidebar
      sidebar: {
        dashboard: 'Tableau de bord',
        newOrder: 'Nouvelle commande',
        orders: 'Commandes',
        orderTracking: 'Suivi des commandes',
        addressBook: 'Carnet d\'adresses',
        expenses: 'Dépenses',
        settings: 'Paramètres',
        tagline: 'Gestion de Blanchisserie',
        todayOverview: "Aperçu du jour",
        todayRevenue: 'Revenus du jour',
        pendingOrders: 'Commandes en attente',
        monthProfit: 'Bénéfice du mois',
        monthExpenses: 'Dépenses du mois',
        version: 'Version',
        offlineMode: 'Mode hors ligne'
      },

      // Dashboard
      dashboard: {
        title: 'Tableau de bord',
        welcome: 'Bienvenue sur Pressia',
        quickActions: 'Actions rapides',
        recentOrders: 'Commandes récentes',
        stats: {
          todayRevenue: 'Revenus du jour',
          monthlyRevenue: 'Revenus du mois',
          monthlyExpenses: 'Dépenses du mois',
          monthlyProfit: 'Bénéfice du mois',
          pendingOrders: 'Commandes en attente',
          completedOrders: 'Commandes terminées'
        },
        actions: {
          newOrder: 'Créer une commande',
          viewOrders: 'Voir toutes les commandes',
          addExpense: 'Ajouter une dépense',
          viewExpenses: 'Voir les dépenses'
        },
        orders: {
          noOrders: 'Aucune commande récente',
          customer: 'Client',
          total: 'Total',
          date: 'Date',
          status: 'Statut',
          markCompleted: 'Marquer comme terminé',
          markPickedUp: 'Marquer comme récupéré'
        }
      },

      // New Order
      newOrder: {
        title: 'Nouvelle commande',
        customerInfo: 'Informations client',
        customerName: 'Nom du client',
        customerPhone: 'Numéro de téléphone',
        pickupDate: 'Date de récupération',
        items: 'Articles',
        addItem: 'Ajouter un article',
        removeItem: 'Supprimer',
        quantity: 'Quantité',
        total: 'Total',
        createOrder: 'Créer la commande',
        orderCreated: 'Commande créée avec succès !',
        printReceipt: 'Imprimer le reçu',
        copyReceipt: 'Copier le reçu',
        newOrder: 'Nouvelle commande'
      },

      // Orders
      orders: {
        title: 'Commandes',
        search: 'Rechercher des commandes...',
        filterByStatus: 'Filtrer par statut',
        all: 'Toutes',
        pending: 'En attente',
        completed: 'Terminé',
        pickedUp: 'Récupéré',
        cancelled: 'Annulé',
        noOrders: 'Aucune commande trouvée',
        viewReceipt: 'Voir le reçu',
        updateStatus: 'Mettre à jour le statut',
        statusUpdated: 'Statut mis à jour avec succès !'
      },

      // Expenses
      expenses: {
        title: 'Dépenses',
        addExpense: 'Ajouter une dépense',
        editExpense: 'Modifier la dépense',
        category: 'Catégorie',
        amount: 'Montant',
        date: 'Date',
        description: 'Description',
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        totalExpenses: 'Total des dépenses',
        monthlyExpenses: 'Dépenses du mois',
        expenseAdded: 'Dépense ajoutée avec succès !',
        expenseUpdated: 'Dépense mise à jour avec succès !',
        expenseDeleted: 'Dépense supprimée avec succès !',
        categories: {
          electricity: 'Électricité',
          water: 'Eau',
          rent: 'Loyer',
          salary: 'Salaire',
          maintenance: 'Maintenance',
          supplies: 'Fournitures',
          other: 'Autre'
        }
      },

      // Address Book
      addressBook: {
        title: 'Carnet d\'adresses',
        subtitle: 'Gérez vos contacts clients',
        addCustomer: 'Ajouter un client',
        editCustomer: 'Modifier le client',
        deleteCustomer: 'Supprimer le client',
        firstName: 'Prénom',
        lastName: 'Nom',
        phone: 'Téléphone',
        firstNamePlaceholder: 'Entrez le prénom',
        lastNamePlaceholder: 'Entrez le nom',
        phonePlaceholder: 'Entrez le numéro de téléphone',
        searchPlaceholder: 'Rechercher des clients...',
        save: 'Enregistrer',
        cancel: 'Annuler',
        noCustomers: 'Aucun client trouvé',
        noSearchResults: 'Aucun client ne correspond à votre recherche',
        customerAdded: 'Client ajouté avec succès !',
        customerUpdated: 'Client mis à jour avec succès !',
        customerDeleted: 'Client supprimé avec succès !',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce client ?',
        fillRequiredFields: 'Veuillez remplir tous les champs requis',
        errorLoading: 'Erreur lors du chargement des clients',
        errorCreating: 'Erreur lors de la création du client',
        errorUpdating: 'Erreur lors de la mise à jour du client',
        errorDeleting: 'Erreur lors de la suppression du client'
      },

      // Settings
      settings: {
        title: 'Paramètres',
        itemTypes: 'Types d\'articles',
        addItemType: 'Ajouter un type d\'article',
        editItemType: 'Modifier le type d\'article',
        name: 'Nom',
        category: 'Catégorie',
        price: 'Prix',
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        itemAdded: 'Type d\'article ajouté avec succès !',
        itemUpdated: 'Type d\'article mis à jour avec succès !',
        itemDeleted: 'Type d\'article supprimé avec succès !',
        database: 'Base de données',
        exportDatabase: 'Exporter la base de données',
        importDatabase: 'Importer la base de données',
        exportSuccess: 'Base de données exportée avec succès !',
        importSuccess: 'Base de données importée avec succès !',
        systemInfo: 'Informations système',
        version: 'Version',
        platform: 'Plateforme',
        offlineMode: 'Mode hors ligne'
      },

      // Receipt
      receipt: {
        title: 'Pressia - Reçu de Blanchisserie',
        orderNumber: 'Numéro de commande',
        date: 'Date',
        customer: 'Client',
        phone: 'Téléphone',
        items: 'Articles',
        pickupDate: 'Date de récupération',
        total: 'Total',
        thankYou: 'Merci d\'avoir choisi Pressia !',
        printInstructions: 'Appuyez sur Ctrl+P pour imprimer ce reçu'
      },

      // Status
      status: {
        pending: 'En attente',
        completed: 'Terminé',
        pickedUp: 'Récupéré',
        cancelled: 'Annulé'
      },

      // Categories
      categories: {
        mensClothing: 'Vêtements Homme',
        womensClothing: 'Vêtements Femme',
        childrensClothing: 'Vêtements Enfant',
        bedding: 'Linge de lit',
        curtains: 'Rideaux',
        other: 'Autre'
      }
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