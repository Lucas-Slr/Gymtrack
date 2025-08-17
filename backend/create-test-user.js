const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTestUser() {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Utilisateur de test existe déjà');
      mongoose.connection.close();
      return;
    }

    // Créer un nouvel utilisateur avec tous les champs requis
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123', // Sera hashé automatiquement
      nom: 'Utilisateur',
      prenom: 'Test',
      age: 25,
      poids: 70,
      taille: 175,
      username: 'testuser'
    });

    await testUser.save();
    console.log('Utilisateur de test créé avec succès');
    console.log('Email: test@example.com');
    console.log('Mot de passe: password123');

    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur de test:', error);
    mongoose.connection.close();
  }
}

createTestUser();
