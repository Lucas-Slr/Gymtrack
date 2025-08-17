const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkSeances() {
  try {
    console.log('Vérification des séances dans la base de données...');
    console.log('================================================');
    
    // Récupérer tous les utilisateurs
    const users = await User.find();
    console.log(`📊 Nombre d'utilisateurs: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user._id})`);
    });
    
    console.log('\n--- SÉANCES ---');
    
    // Récupérer toutes les séances
    const allSeances = await Seance.find();
    console.log(`📊 Nombre total de séances: ${allSeances.length}`);
    
    // Vérifier les séances avec userId
    const seancesAvecUser = await Seance.find({ userId: { $exists: true } });
    console.log(`✅ Séances avec userId: ${seancesAvecUser.length}`);
    
    // Vérifier les séances sans userId
    const seancesSansUser = await Seance.find({ userId: { $exists: false } });
    console.log(`❌ Séances sans userId: ${seancesSansUser.length}`);
    
    if (seancesSansUser.length > 0) {
      console.log('\nSéances sans userId:');
      seancesSansUser.forEach((seance, index) => {
        console.log(`${index + 1}. "${seance.titre}" - ID: ${seance._id}`);
      });
    }
    
    // Afficher quelques séances avec userId
    if (seancesAvecUser.length > 0) {
      console.log('\nExemples de séances avec userId:');
      seancesAvecUser.slice(0, 3).forEach((seance, index) => {
        console.log(`${index + 1}. "${seance.titre}" - ID: ${seance._id} - UserID: ${seance.userId}`);
      });
    }
    
    // Vérifier par utilisateur
    if (users.length > 0) {
      const firstUser = users[0];
      const seancesUser = await Seance.find({ userId: firstUser._id });
      console.log(`\n📊 Séances pour ${firstUser.email}: ${seancesUser.length}`);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

checkSeances();
