const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connexion à MongoDB (seulement si pas en mode test)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
    
    // Démarrer le serveur seulement après la connexion MongoDB
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err);
    process.exit(1);
  });
} else {
  console.log('Mode test - MongoDB sera géré par les tests');
}

// Export de l'app pour les tests
module.exports = app;
