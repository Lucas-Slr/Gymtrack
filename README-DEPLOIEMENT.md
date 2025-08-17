# 🏋️‍♂️ GymTrack - Guide de Déploiement

## 📋 Prérequis

### Système d'exploitation
- **Windows 10/11** ou **macOS** ou **Linux**
- Au moins **4 GB de RAM** disponible
- Au moins **2 GB d'espace disque** libre

### Logiciels requis
1. **Docker Desktop** (obligatoire)
   - Télécharger depuis : https://www.docker.com/products/docker-desktop/
   - Installer et redémarrer l'ordinateur
   - S'assurer que Docker Desktop est en cours d'exécution

## 🚀 Installation et Démarrage

### Option 1 : Démarrage Local (Recommandé pour les Jurys)

**Avantages :** Fonctionne sans internet, plus rapide, données isolées

#### Windows
1. Double-cliquer sur le fichier `start-gymtrack.bat`
2. Attendre que l'application se lance (2-3 minutes)
3. Ouvrir votre navigateur et aller sur : **http://localhost**

#### macOS/Linux
1. Ouvrir un terminal dans le dossier du projet
2. Exécuter : `./start-gymtrack.sh`
3. Attendre que l'application se lance (2-3 minutes)
4. Ouvrir votre navigateur et aller sur : **http://localhost**

### Option 2 : Démarrage avec MongoDB Atlas (Cloud)

**Avantages :** Données partagées, pas de limite de stockage local
**Inconvénients :** Nécessite une connexion internet

#### Windows
1. Double-cliquer sur le fichier `start-gymtrack-atlas.bat`
2. Attendre que l'application se lance (2-3 minutes)
3. Ouvrir votre navigateur et aller sur : **http://localhost**

### Option 3 : Démarrage Manuel

Si les scripts automatiques ne fonctionnent pas :

1. Ouvrir un terminal dans le dossier du projet
2. Exécuter : `docker-compose up --build -d` (local) ou `docker-compose -f docker-compose-atlas.yml up --build -d` (Atlas)
3. Attendre la fin de la construction (2-3 minutes)
4. Ouvrir votre navigateur et aller sur : **http://localhost**

## 🔐 Comptes de Test

Un compte de test est automatiquement créé pour vous :

- **Email** : `test@example.com`
- **Mot de passe** : `password`

## 🌐 Accès à l'Application

Une fois démarrée, l'application est accessible via :

- **Interface utilisateur** : http://localhost
- **API Backend** : http://localhost:5000
- **Base de données** : localhost:27017

## 🛑 Arrêt de l'Application

### Windows
Double-cliquer sur `stop-gymtrack.bat`

### macOS/Linux
Exécuter : `./stop-gymtrack.sh`

### Manuel
Exécuter : `docker-compose down`

## 🔧 Dépannage

### Problème : "Docker n'est pas installé"
**Solution** : Installer Docker Desktop depuis https://www.docker.com/products/docker-desktop/

### Problème : "Docker Desktop n'est pas en cours d'exécution"
**Solution** : 
1. Ouvrir Docker Desktop
2. Attendre que l'icône Docker devienne verte
3. Réessayer le démarrage

### Problème : "Port déjà utilisé"
**Solution** :
1. Arrêter l'application : `docker-compose down`
2. Attendre 30 secondes
3. Redémarrer : `docker-compose up -d`

### Problème : "Erreur de connexion à la base de données"
**Solution** :
1. Arrêter complètement : `docker-compose down -v`
2. Redémarrer : `docker-compose up --build -d`

## 📱 Fonctionnalités de l'Application

### Pour les Jurys
1. **Connexion** : Utiliser le compte test fourni
2. **Dashboard** : Vue d'ensemble des statistiques
3. **Création de séances** : Créer des séances d'entraînement
4. **Suivi en temps réel** : Chronomètre et suivi des exercices
5. **Historique** : Consulter les séances passées
6. **Profil** : Gérer les informations personnelles

### Tests Recommandés
1. ✅ Créer un compte utilisateur
2. ✅ Se connecter avec le compte test
3. ✅ Créer une nouvelle séance
4. ✅ Démarrer une séance et utiliser le chronomètre
5. ✅ Ajouter des exercices à la séance
6. ✅ Terminer une séance
7. ✅ Consulter l'historique des séances
8. ✅ Modifier le profil utilisateur

## 📞 Support

En cas de problème technique :
1. Vérifier que Docker Desktop est bien installé et en cours d'exécution
2. Redémarrer l'application avec les scripts fournis
3. Consulter les logs : `docker-compose logs`

## 🏗️ Architecture Technique

L'application utilise :
- **Frontend** : Angular 20 avec Ionic
- **Backend** : Node.js avec Express
- **Base de données** : MongoDB
- **Conteneurisation** : Docker avec Docker Compose

---

**Note** : Cette application est conçue pour fonctionner entièrement en local sans connexion internet après le premier démarrage.
