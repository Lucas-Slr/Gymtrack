# 🧪 Tests GymTrack

Ce document décrit la suite de tests complète pour l'application GymTrack, avec un objectif de **80% de couverture de code** sur les deux projets (Backend et Frontend).

## 📊 Objectifs de Couverture

- **Backend** : 80% de couverture (lignes, branches, fonctions, statements)
- **Frontend** : 80% de couverture (lignes, branches, fonctions, statements)

## 🏗️ Architecture des Tests

### Backend (Node.js + Express + MongoDB)

#### Technologies utilisées
- **Jest** : Framework de test principal
- **Supertest** : Tests d'intégration HTTP
- **MongoDB Memory Server** : Base de données de test

#### Structure des tests
```
backend/
├── tests/
│   ├── setup.js                 # Configuration des tests
│   ├── models/
│   │   ├── User.test.js         # Tests du modèle User
│   │   └── Seance.test.js       # Tests du modèle Seance
│   └── routes/
│       ├── auth.test.js         # Tests des routes d'authentification
│       └── seance.test.js       # Tests des routes de séances
├── jest.config.js               # Configuration Jest
└── package.json                 # Scripts de test
```

#### Tests couverts
- ✅ **Modèles** : Validation, méthodes d'instance, hooks
- ✅ **Routes d'authentification** : Register, Login, Profile
- ✅ **Routes de séances** : CRUD complet, séance en cours
- ✅ **Gestion d'erreurs** : Codes HTTP, messages d'erreur
- ✅ **Sécurité** : Authentification, autorisation

### Frontend (Angular)

#### Technologies utilisées
- **Jasmine** : Framework de test
- **Karma** : Runner de tests
- **Angular Testing Utilities** : TestBed, ComponentFixture
- **HttpClientTestingModule** : Tests des services HTTP

#### Structure des tests
```
Frontend/src/
├── app/
│   ├── services/
│   │   ├── auth.service.spec.ts     # Tests du service d'authentification
│   │   └── seance.service.spec.ts   # Tests du service de séances
│   └── components/
│       └── icon/
│           └── icon.component.spec.ts # Tests du composant Icon
├── karma.conf.js                     # Configuration Karma
└── package.json                      # Scripts de test
```

#### Tests couverts
- ✅ **Services** : Méthodes HTTP, gestion d'erreurs, localStorage
- ✅ **Composants** : Inputs, outputs, logique métier
- ✅ **Intégration** : Communication avec l'API
- ✅ **Gestion d'état** : Authentification, données utilisateur

## 🚀 Exécution des Tests

### Tests Backend

```bash
cd backend
npm test                    # Tests avec couverture
npm run test:watch         # Tests en mode watch
npm run test:coverage      # Tests avec rapport de couverture détaillé
```

### Tests Frontend

```bash
cd Frontend
npm test                    # Tests avec couverture
npm run test:watch         # Tests en mode watch
npm run test:coverage      # Tests avec rapport de couverture détaillé
```

### Tous les Tests (Scripts)

#### Linux/Mac
```bash
chmod +x run-tests.sh
./run-tests.sh
```

#### Windows
```powershell
.\run-tests.ps1
```

## 📈 Rapports de Couverture

### Backend
- **Fichier** : `backend/coverage/index.html`
- **Métriques** :
  - Statements : 80%+
  - Branches : 80%+
  - Functions : 80%+
  - Lines : 80%+

### Frontend
- **Fichier** : `Frontend/coverage/frontend/index.html`
- **Métriques** :
  - Statements : 80%+
  - Branches : 80%+
  - Functions : 80%+
  - Lines : 80%+

## 🧪 Types de Tests

### Tests Unitaires
- **Backend** : Modèles, utilitaires, logique métier
- **Frontend** : Services, composants, pipes

### Tests d'Intégration
- **Backend** : Routes API, middleware, base de données
- **Frontend** : Communication HTTP, gestion d'état

### Tests de Validation
- **Backend** : Validation des données, gestion d'erreurs
- **Frontend** : Validation des formulaires, gestion des erreurs

## 🔧 Configuration

### Backend (Jest)
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Frontend (Karma)
```javascript
// karma.conf.js
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

## 📋 Checklist des Tests

### Backend
- [x] Modèle User (validation, méthodes, hooks)
- [x] Modèle Seance (validation, méthodes, virtuals)
- [x] Routes d'authentification (register, login, profile)
- [x] Routes de séances (CRUD, séance en cours)
- [x] Middleware d'authentification
- [x] Gestion d'erreurs
- [x] Validation des données

### Frontend
- [x] Service d'authentification
- [x] Service de séances
- [x] Composant Icon
- [x] Gestion du localStorage
- [x] Communication HTTP
- [x] Gestion des erreurs

## 🎯 Bonnes Pratiques

### Backend
1. **Isolation** : Chaque test utilise une base de données propre
2. **Mocking** : Simulation des erreurs de base de données
3. **Validation** : Tests des cas limites et d'erreur
4. **Sécurité** : Tests d'authentification et d'autorisation

### Frontend
1. **Isolation** : Tests indépendants avec TestBed
2. **Mocking** : Simulation des réponses HTTP
3. **Composants** : Tests des inputs, outputs et comportements
4. **Services** : Tests des appels API et gestion d'état

## 🚨 Gestion des Erreurs

### Backend
- Tests des codes HTTP appropriés
- Validation des messages d'erreur
- Gestion des exceptions de base de données
- Tests de sécurité (tokens invalides, accès non autorisé)

### Frontend
- Tests des erreurs HTTP
- Gestion des états de chargement
- Validation des formulaires
- Tests de navigation et redirection

## 📊 Métriques de Qualité

- **Couverture de code** : 80% minimum
- **Tests unitaires** : 100% des services et modèles
- **Tests d'intégration** : 100% des routes API
- **Tests de composants** : 100% des composants critiques
- **Temps d'exécution** : < 30 secondes pour tous les tests

## 🔄 Maintenance

### Ajout de nouveaux tests
1. Créer le fichier de test avec l'extension `.test.js` (backend) ou `.spec.ts` (frontend)
2. Suivre la structure existante
3. Ajouter les tests dans la configuration de couverture
4. Vérifier que la couverture reste > 80%

### Mise à jour des tests
1. Exécuter tous les tests avant modification
2. Mettre à jour les tests en parallèle du code
3. Vérifier la couverture après modification
4. Documenter les changements

---

**Note** : Cette suite de tests garantit la qualité et la fiabilité de l'application GymTrack en couvrant tous les aspects critiques du code.
