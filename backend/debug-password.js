const mongoose = require('mongoose');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugPassword() {
  try {
    // Trouver l'utilisateur de test
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('Utilisateur de test non trouvé');
      return;
    }

    console.log('Utilisateur trouvé:', {
      email: user.email,
      passwordHash: user.password,
      isActive: user.isActive
    });

    // Tester la comparaison de mot de passe
    const isPasswordValid = await user.comparePassword('password123');
    console.log('Mot de passe valide:', isPasswordValid);

    // Tester avec un mot de passe incorrect
    const isPasswordInvalid = await user.comparePassword('wrongpassword');
    console.log('Mot de passe incorrect:', isPasswordInvalid);

    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

debugPassword();

