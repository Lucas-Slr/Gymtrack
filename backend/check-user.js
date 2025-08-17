const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkUser() {
  try {
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('Utilisateur non trouvé');
      return;
    }

    console.log('Utilisateur trouvé:');
    console.log('Email:', user.email);
    console.log('Nom:', user.nom);
    console.log('Prénom:', user.prenom);
    console.log('Mot de passe hashé:', user.password);
    console.log('Age:', user.age);
    console.log('Poids:', user.poids);
    console.log('Taille:', user.taille);

    // Test de comparaison de mot de passe
    const isPasswordValid = await user.comparePassword('password123');
    console.log('Mot de passe valide:', isPasswordValid);

    // Test direct avec bcrypt
    const directTest = await bcrypt.compare('password123', user.password);
    console.log('Test direct bcrypt:', directTest);

    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

checkUser();
