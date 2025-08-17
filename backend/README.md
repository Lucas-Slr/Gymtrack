# Backend GymTrack - Système d'Authentification

## Configuration requise

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du dossier `backend` avec les variables suivantes :

```env
# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/gymtrack

# Configuration JWT (IMPORTANT: Changez ces secrets en production)
JWT_SECRET=votre_secret_jwt_tres_securise_et_long_au_moins_32_caracteres
JWT_REFRESH_SECRET=votre_refresh_secret_jwt_tres_securise_et_long_au_moins_32_caracteres

# Configuration serveur
PORT=5000
NODE_ENV=development

# Configuration Frontend
FRONTEND_URL=http://localhost:4200
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Démarrage du serveur

```bash
npm start
```

## Fonctionnalités d'authentification

### Sécurité implémentée

1. **Hachage des mots de passe** : Utilisation de bcryptjs avec un salt de 12 rounds
2. **Tokens JWT** : 
   - Access Token : 15 minutes
   - Refresh Token : 72 heures
3. **Rate limiting** : Protection contre les attaques par force brute
4. **Validation des données** : Validation côté serveur avec express-validator
5. **Headers de sécurité** : Utilisation de Helmet pour les en-têtes de sécurité
6. **CORS configuré** : Autorise uniquement le frontend spécifié

### Routes d'authentification

- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion utilisateur
- `POST /auth/refresh` - Rafraîchissement du token
- `POST /auth/logout` - Déconnexion
- `GET /auth/profile` - Récupération du profil utilisateur
- `GET /auth/verify` - Vérification de la validité du token

### Modèle utilisateur

L'utilisateur contient les champs suivants :
- `nom`, `prenom` : Informations personnelles
- `email` : Email unique pour la connexion
- `password` : Mot de passe hashé
- `age`, `poids`, `taille` : Données physiques
- `refreshTokens` : Liste des tokens de rafraîchissement actifs
- `lastLogin` : Date de dernière connexion
- `isActive` : Statut du compte

### Middleware de sécurité

- `authenticateToken` : Vérifie le token d'accès pour les routes protégées
- `authenticateRefreshToken` : Vérifie le token de rafraîchissement
- `requireGuest` : Empêche l'accès aux pages login/register si déjà connecté

## Routes protégées

Toutes les routes `/seance/*` nécessitent une authentification valide.

## Gestion des erreurs

Le système gère automatiquement :
- Tokens expirés
- Tentatives de connexion multiples
- Validation des données
- Erreurs de base de données

## Production

Pour la production, assurez-vous de :
1. Changer les secrets JWT
2. Configurer une base de données MongoDB sécurisée
3. Utiliser HTTPS
4. Configurer les variables d'environnement appropriées 