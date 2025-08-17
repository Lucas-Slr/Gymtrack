const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkUsersSeances() {
  try {
    console.log('Vérification des utilisateurs et leurs séances...');
    console.log('===============================================');
    
    // Récupérer tous les utilisateurs
    const users = await User.find();
    console.log(`📊 Nombre d'utilisateurs: ${users.length}`);
    
    // Pour chaque utilisateur, compter ses séances
    for (const user of users) {
      const seancesUser = await Seance.find({ userId: user._id });
      console.log(`\n👤 ${user.email} (ID: ${user._id})`);
      console.log(`   📊 Séances: ${seancesUser.length}`);
      
      if (seancesUser.length > 0) {
        console.log(`   📝 Exemples: ${seancesUser.slice(0, 3).map(s => s.titre).join(', ')}`);
      }
    }
    
    // Vérifier les séances sans utilisateur
    const seancesSansUser = await Seance.find({ userId: { $exists: false } });
    console.log(`\n❌ Séances sans userId: ${seancesSansUser.length}`);
    
    // Vérifier les séances avec un userId invalide
    const seancesAvecUser = await Seance.find({ userId: { $exists: true } });
    console.log(`✅ Séances avec userId: ${seancesAvecUser.length}`);
    
    // Trouver l'utilisateur avec le plus de séances
    let userAvecPlusDeSeances = null;
    let maxSeances = 0;
    
    for (const user of users) {
      const count = await Seance.countDocuments({ userId: user._id });
      if (count > maxSeances) {
        maxSeances = count;
        userAvecPlusDeSeances = user;
      }
    }
    
    if (userAvecPlusDeSeances) {
      console.log(`\n🏆 Utilisateur avec le plus de séances: ${userAvecPlusDeSeances.email} (${maxSeances} séances)`);
      console.log(`   ID: ${userAvecPlusDeSeances._id}`);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

checkUsersSeances();








