const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    
    // Lister tous les index de la collection users
    console.log('Index actuels de la collection users:');
    const indexes = await db.collection('users').indexes();
    console.log(indexes);
    
    // Supprimer l'index problématique sur username s'il existe
    try {
      await db.collection('users').dropIndex('username_1');
      console.log('Index username_1 supprimé avec succès');
    } catch (error) {
      console.log('Index username_1 n\'existe pas ou déjà supprimé');
    }
    
    // Recréer les index nécessaires
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('Index email recréé');
    
    await db.collection('users').createIndex({ username: 1 }, { unique: true, sparse: true });
    console.log('Index username recréé avec sparse: true');
    
    console.log('Base de données corrigée avec succès');
    
  } catch (error) {
    console.error('Erreur lors de la correction:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
}

fixDatabase();
