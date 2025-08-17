const { MongoMemoryServer } = require('mongodb-memory-server');

// Configuration pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Augmenter le timeout pour les tests
jest.setTimeout(30000);

let mongoServer;

// Fonction pour démarrer le serveur MongoDB en mémoire
global.startMongoMemoryServer = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  return mongoUri;
};

// Fonction pour arrêter le serveur MongoDB en mémoire
global.stopMongoMemoryServer = async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
};

// Fonction utilitaire pour nettoyer la base de données
global.cleanDatabase = async () => {
  const mongoose = require('mongoose');
  
  try {
    if (mongoose.connection.readyState === 1) {
      // Supprimer toutes les collections de la base de données
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      for (const collection of collections) {
        try {
          await mongoose.connection.db.collection(collection.name).deleteMany({});
        } catch (deleteError) {
          console.warn(`Erreur lors de la suppression de la collection ${collection.name}:`, deleteError.message);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage de la base de données:', error.message);
  }
};

// Fonction pour créer une nouvelle base de données pour chaque test
global.createTestDatabase = async () => {
  const mongoose = require('mongoose');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  
  // Arrêter le serveur précédent s'il existe
  if (global.currentMongoServer) {
    await global.currentMongoServer.stop();
  }
  
  // Créer un nouveau serveur
  global.currentMongoServer = await MongoMemoryServer.create();
  const mongoUri = global.currentMongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  
  // Se connecter à la nouvelle base de données
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);
  
  return mongoUri;
};

// Fonction pour se connecter à la base de données de test
global.connectTestDB = async () => {
  const mongoose = require('mongoose');
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données de test:', error.message);
  }
};

// Fonction pour déconnecter de la base de données de test
global.disconnectTestDB = async () => {
  const mongoose = require('mongoose');
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion de la base de données de test:', error.message);
  }
};
