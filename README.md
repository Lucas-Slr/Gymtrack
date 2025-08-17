# 🏋️‍♂️ GymTrack - Application de Suivi d'Entraînement

## 📖 Description

GymTrack est une application web complète pour le suivi d'entraînement en salle de sport. Elle permet aux utilisateurs de créer, gérer et suivre leurs séances d'entraînement avec un chronomètre intégré et des statistiques détaillées.

## 🚀 Démarrage Rapide

### Pour les Jurys (Installation Simple)

1. **Installer Docker Desktop** : https://www.docker.com/products/docker-desktop/
2. **Double-cliquer** sur `start-gymtrack.bat` (Windows) ou exécuter `./start-gymtrack.sh` (Mac/Linux)
3. **Ouvrir** http://localhost dans votre navigateur
4. **Se connecter** avec : `test@example.com` / `password`

📋 **Documentation complète** : [README-DEPLOIEMENT.md](README-DEPLOIEMENT.md)

## 🏗️ Architecture

- **Frontend** : Angular 20 + Ionic + Tailwind CSS
- **Backend** : Node.js + Express + MongoDB
- **Base de données** : MongoDB
- **Conteneurisation** : Docker + Docker Compose

## 🎯 Fonctionnalités

### 👤 Gestion des Utilisateurs
- Inscription et connexion sécurisées
- Profil utilisateur personnalisable
- Gestion des objectifs et du niveau

### 🏋️‍♂️ Gestion des Séances
- Création de séances d'entraînement
- Ajout d'exercices avec répétitions et poids
- Chronomètre intégré pour le suivi en temps réel
- Historique des séances complètes

### 📊 Statistiques et Suivi
- Dashboard avec statistiques détaillées
- Graphiques de progression
- Suivi des performances

### ⏱️ Fonctionnalités Avancées
- Chronomètre avec pause/reprise
- Sauvegarde automatique des séances
- Interface responsive et moderne

## 🛠️ Développement

### Prérequis
- Node.js 18+
- MongoDB
- Angular CLI

### Installation Locale

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd Frontend
npm install
npm start
```

### Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd Frontend
npm test
```

## 📁 Structure du Projet

```
GymTrack/
├── backend/                 # API Node.js
│   ├── controllers/        # Contrôleurs
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── middleware/        # Middleware
│   └── tests/             # Tests backend
├── Frontend/              # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Composants réutilisables
│   │   │   ├── pages/      # Pages de l'application
│   │   │   ├── services/   # Services Angular
│   │   │   └── models/     # Modèles TypeScript
│   │   └── ...
│   └── ...
├── docker-compose.yml     # Configuration Docker
├── start-gymtrack.bat     # Script de démarrage Windows
├── start-gymtrack.sh      # Script de démarrage Unix
└── README-DEPLOIEMENT.md  # Guide de déploiement
```

## 🔧 Configuration

### Variables d'Environnement Backend

```env
MONGODB_URI=mongodb://localhost:27017/gymtrack
JWT_SECRET=votre_secret_jwt
JWT_REFRESH_SECRET=votre_refresh_secret
PORT=5000
FRONTEND_URL=http://localhost:4200
```

## 🧪 Tests

L'application inclut une suite de tests complète :

- **Tests unitaires** : Backend (Jest) et Frontend (Vitest)
- **Tests d'intégration** : API endpoints
- **Tests de modèles** : Validation des données

```bash
# Exécuter tous les tests
npm run test:all
```

## 📱 Interface Utilisateur

L'application utilise un design moderne avec :
- **Thème** : Vert (#34ad00) et noir (#191818)
- **Framework** : Ionic + Angular Material
- **Styling** : Tailwind CSS
- **Responsive** : Compatible mobile et desktop

## 🔒 Sécurité

- **Authentification** : JWT avec refresh tokens
- **Validation** : Express-validator pour les données
- **Rate Limiting** : Protection contre les attaques
- **Helmet** : Headers de sécurité
- **CORS** : Configuration sécurisée

## 📈 Performance

- **Lazy Loading** : Chargement à la demande
- **Optimisation** : Images et assets compressés
- **Cache** : Stratégies de mise en cache
- **Compression** : Gzip pour les réponses

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est développé dans le cadre d'un diplôme de fin d'année.

## 📞 Support

Pour toute question ou problème :
1. Consulter la [documentation de déploiement](README-DEPLOIEMENT.md)
2. Vérifier les logs Docker : `docker-compose logs`
3. Tester l'installation : `test-docker.bat`

---

**Développé avec ❤️ pour le suivi d'entraînement**
