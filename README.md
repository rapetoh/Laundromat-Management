# Pressia - Système de Gestion de Blanchisserie

**Pressia** est un système de gestion de blanchisserie hors ligne conçu spécifiquement pour les entreprises de blanchisserie en Afrique francophone, en commençant par le Togo.

## 🎯 Objectif

Construire un système logiciel complet pour les entreprises de blanchisserie/pressing qui fonctionne entièrement hors ligne et aide les réceptionnistes, gestionnaires de blanchisserie et propriétaires à gérer les commandes, générer des reçus, suivre les dépenses et analyser les bénéfices.

## 🚀 Fonctionnalités Principales

### Application Interne (Réceptionniste & Gestionnaire)
- ✅ **Création de commandes** par type d'article (chemise homme, jupe, etc.)
- ✅ **Calcul automatique** du coût total
- ✅ **Date de récupération** prédéfinie
- ✅ **Génération de reçus** avec impression ou partage WhatsApp
- ✅ **Suivi des dépenses** avec catégories
- ✅ **Tableau de bord** avec calcul des bénéfices (Revenus - Dépenses)
- ✅ **Historique des commandes** avec recherche
- ✅ **Export/Sauvegarde** vers fichier (JSON ou SQLite)
- ✅ **Fonctionnement 100% hors ligne**

### Fonctionnalités Avancées
- 🎨 **Interface moderne** avec Tailwind CSS
- 📱 **Design responsive** pour différents écrans
- 🔄 **Gestion des statuts** de commandes (En attente, Terminé, Récupéré)
- 📊 **Statistiques en temps réel**
- 🖨️ **Impression de reçus** professionnels
- 💾 **Base de données SQLite** locale et sécurisée

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Interface utilisateur
- **Tailwind CSS** - Styling et design
- **React Router** - Navigation
- **React Icons** - Icônes
- **React Hot Toast** - Notifications

### Backend & Desktop
- **Electron.js** - Application desktop
- **SQLite** - Base de données locale
- **Better-SQLite3** - Interface SQLite pour Node.js

### Utilitaires
- **date-fns** - Manipulation des dates
- **jsPDF** - Génération de PDF
- **uuid** - Génération d'identifiants uniques

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **Git**

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd pressia-laundry-management
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer l'application en mode développement
```bash
npm run electron-dev
```

### 4. Construire l'application pour la production
```bash
npm run dist
```

## 📁 Structure du Projet

```
pressia-laundry-management/
├── public/
│   ├── electron.js          # Processus principal Electron
│   ├── preload.js           # Script de préchargement sécurisé
│   └── index.html           # Page HTML principale
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Sidebar.js       # Barre latérale de navigation
│   │   └── Receipt.js       # Composant de reçu
│   ├── pages/               # Pages de l'application
│   │   ├── Dashboard.js     # Tableau de bord
│   │   ├── NewOrder.js      # Création de commande
│   │   ├── Orders.js        # Gestion des commandes
│   │   ├── Expenses.js      # Gestion des dépenses
│   │   └── Settings.js      # Paramètres
│   ├── utils/               # Utilitaires
│   │   └── formatters.js    # Fonctions de formatage
│   ├── App.js               # Composant principal
│   ├── index.js             # Point d'entrée React
│   └── index.css            # Styles globaux
├── package.json             # Configuration npm
├── tailwind.config.js       # Configuration Tailwind
└── README.md               # Documentation
```

## 🎯 Utilisation

### 1. Tableau de Bord
- Vue d'ensemble des statistiques
- Revenus du jour et du mois
- Commandes en attente
- Bénéfices calculés automatiquement

### 2. Nouvelle Commande
1. Saisir les informations du client
2. Sélectionner les articles et quantités
3. Vérifier le total calculé automatiquement
4. Générer le reçu imprimable

### 3. Gestion des Commandes
- Voir toutes les commandes
- Filtrer par statut
- Rechercher par nom ou téléphone
- Mettre à jour les statuts

### 4. Gestion des Dépenses
- Ajouter des dépenses par catégorie
- Suivre les dépenses mensuelles
- Analyser les coûts

### 5. Paramètres
- Gérer les types d'articles
- Exporter/Importer la base de données
- Configurer l'application

## 💾 Base de Données

L'application utilise **SQLite** avec les tables suivantes :

### Tables Principales
- **orders** - Commandes des clients
- **expenses** - Dépenses de l'entreprise
- **item_types** - Types d'articles et prix
- **settings** - Paramètres de l'application

### Structure des Données
```sql
-- Commandes
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  items TEXT NOT NULL, -- JSON
  total_amount REAL NOT NULL,
  pickup_date TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Dépenses
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Types d'articles
CREATE TABLE item_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Configuration

### Variables d'Environnement
L'application fonctionne entièrement hors ligne et ne nécessite pas de variables d'environnement.

### Personnalisation
- **Couleurs** : Modifier `tailwind.config.js`
- **Types d'articles** : Ajouter dans les paramètres
- **Catégories de dépenses** : Modifier dans `Expenses.js`

## 📱 Fonctionnalités Offline

- ✅ **Base de données locale** SQLite
- ✅ **Pas de connexion internet** requise
- ✅ **Sauvegarde locale** des données
- ✅ **Export/Import** de la base de données
- ✅ **Fonctionnement complet** hors ligne

## 🖨️ Impression de Reçus

L'application génère des reçus professionnels avec :
- Logo et informations de l'entreprise
- Détails du client
- Liste des articles avec prix
- Total calculé
- Date de récupération
- Instructions d'impression

## 🔒 Sécurité

- **Isolation du contexte** Electron
- **Communication sécurisée** entre processus
- **Base de données locale** protégée
- **Pas de données sensibles** envoyées en ligne

## 🚀 Déploiement

### Pour Windows
```bash
npm run dist
```
L'exécutable sera généré dans le dossier `dist/`.

### Pour le Développement
```bash
npm run electron-dev
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les issues GitHub
3. Créer une nouvelle issue si nécessaire

## 🔮 Roadmap

### Version 1.1
- [ ] Application mobile React Native
- [ ] Synchronisation cloud optionnelle
- [ ] Notifications push
- [ ] Rapports avancés

### Version 1.2
- [ ] Gestion multi-boutiques
- [ ] API REST
- [ ] Intégration paiement mobile
- [ ] Analytics avancées

---

**Pressia** - Simplifiez la gestion de votre blanchisserie ! 🧺✨ 