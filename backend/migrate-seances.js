const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateSeances() {
  try {
    console.log('Migration des séances...');
    
    // Récupérer le premier utilisateur (ou créer un utilisateur par défaut)
    let defaultUser = await User.findOne();
    
    if (!defaultUser) {
      console.log('Aucun utilisateur trouvé, création d\'un utilisateur par défaut...');
      defaultUser = new User({
        email: 'default@example.com',
        password: 'password123',
        nom: 'Utilisateur',
        prenom: 'Par défaut',
        age: 25,
        poids: 70,
        taille: 175,
        username: 'defaultuser'
      });
      await defaultUser.save();
      console.log('Utilisateur par défaut créé:', defaultUser._id);
    }
    
    // Récupérer toutes les séances sans userId
    const seancesSansUser = await Seance.find({ userId: { $exists: false } });
    console.log(`${seancesSansUser.length} séances trouvées sans utilisateur`);
    
    if (seancesSansUser.length === 0) {
      console.log('Aucune migration nécessaire');
      return;
    }
    
    // Associer chaque séance à l'utilisateur par défaut
    for (const seance of seancesSansUser) {
      seance.userId = defaultUser._id;
      await seance.save();
      console.log(`Séance "${seance.titre}" associée à l'utilisateur ${defaultUser.email}`);
    }
    
    console.log('Migration terminée avec succès !');
    console.log(`Toutes les séances sont maintenant associées à l'utilisateur: ${defaultUser.email}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    mongoose.connection.close();
  }
}

migrateSeances();
