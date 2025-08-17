const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkSeancesStatus() {
  try {
    console.log('Vérification du statut des séances...');
    console.log('=====================================');
    
    // Récupérer le premier utilisateur
    const defaultUser = await User.findOne();
    if (!defaultUser) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`Utilisateur: ${defaultUser.email} (ID: ${defaultUser._id})`);
    
    // Vérifier toutes les séances de l'utilisateur
    const seancesUser = await Seance.find({ userId: defaultUser._id });
    console.log(`\n📊 Total des séances pour l'utilisateur: ${seancesUser.length}`);
    
    // Vérifier les séances en cours
    const seancesEnCours = await Seance.find({ userId: defaultUser._id, enCours: true });
    console.log(`🔄 Séances en cours: ${seancesEnCours.length}`);
    
    // Vérifier les séances terminées
    const seancesTerminees = await Seance.find({ userId: defaultUser._id, enCours: false });
    console.log(`✅ Séances terminées: ${seancesTerminees.length}`);
    
    // Afficher quelques exemples
    if (seancesEnCours.length > 0) {
      console.log('\nSéances en cours:');
      seancesEnCours.slice(0, 3).forEach((seance, index) => {
        console.log(`${index + 1}. "${seance.titre}" - enCours: ${seance.enCours}`);
      });
    }
    
    if (seancesTerminees.length > 0) {
      console.log('\nSéances terminées:');
      seancesTerminees.slice(0, 3).forEach((seance, index) => {
        console.log(`${index + 1}. "${seance.titre}" - enCours: ${seance.enCours}`);
      });
    }
    
    // Simuler ce que fait l'API /stats
    const seancesPourStats = await Seance.find({ userId: defaultUser._id, enCours: false });
    console.log(`\n🎯 Séances pour les statistiques (enCours: false): ${seancesPourStats.length}`);
    
    if (seancesPourStats.length === 0) {
      console.log('⚠️  Aucune séance terminée trouvée - c\'est pourquoi le dashboard affiche 0');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

checkSeancesStatus();








