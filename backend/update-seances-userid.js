const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateSeancesUserId() {
  try {
    console.log('Mise à jour des séances avec userId...');
    
    // Récupérer le premier utilisateur
    const defaultUser = await User.findOne();
    
    if (!defaultUser) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données');
      return;
    }
    
    console.log(`Utilisateur trouvé: ${defaultUser.email} (ID: ${defaultUser._id})`);
    
    // Récupérer toutes les séances sans userId
    const seancesSansUser = await Seance.find({ userId: { $exists: false } });
    console.log(`${seancesSansUser.length} séances trouvées sans userId`);
    
    if (seancesSansUser.length === 0) {
      console.log('Toutes les séances ont déjà un userId');
      return;
    }
    
    // Mettre à jour chaque séance avec le userId
    for (const seance of seancesSansUser) {
      seance.userId = defaultUser._id;
      await seance.save();
      console.log(`✅ Séance "${seance.titre}" mise à jour avec userId: ${defaultUser._id}`);
    }
    
    console.log('\n🎉 Mise à jour terminée !');
    console.log(`${seancesSansUser.length} séances ont été associées à l'utilisateur ${defaultUser.email}`);
    
    // Vérifier le résultat
    const seancesAvecUser = await Seance.find({ userId: defaultUser._id });
    console.log(`📊 Total des séances pour l'utilisateur: ${seancesAvecUser.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

updateSeancesUserId();








