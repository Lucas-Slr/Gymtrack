const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testRegistration() {
  try {
    console.log('Variables d\'environnement:');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Défini' : 'Manquant');
    console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'Défini' : 'Manquant');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Défini' : 'Manquant');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');
    
    // Test de création d'utilisateur
    const userData = {
      nom: 'Test',
      prenom: 'User',
      email: 'test@example.com',
      password: 'password123',
      age: 25,
      poids: 70,
      taille: 175
    };
    
    console.log('Tentative de création d\'utilisateur...');
    const user = new User(userData);
    await user.save();
    console.log('Utilisateur créé avec succès:', user._id);
    
    // Test de la méthode addRefreshToken
    console.log('Test de addRefreshToken...');
    await user.addRefreshToken('test-token');
    console.log('Token ajouté avec succès');
    
    await mongoose.connection.close();
    console.log('Test terminé avec succès');
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
    console.error('Stack trace:', error.stack);
  }
}

testRegistration();
