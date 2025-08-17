const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testDashboard() {
  try {
    console.log('🔍 Test des données du dashboard...');
    
    // Récupérer le premier utilisateur
    const user = await User.findOne();
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`👤 Utilisateur trouvé: ${user.email} (ID: ${user._id})`);
    
    // Récupérer toutes les séances de l'utilisateur
    const toutesSeances = await Seance.find({ userId: user._id });
    console.log(`📊 Toutes les séances: ${toutesSeances.length}`);
    
    // Séances en cours
    const seancesEnCours = await Seance.find({ userId: user._id, enCours: true });
    console.log(`🎯 Séances en cours: ${seancesEnCours.length}`);
    
    // Séances terminées
    const seancesTerminees = await Seance.find({ userId: user._id, enCours: false });
    console.log(`✅ Séances terminées: ${seancesTerminees.length}`);
    
    // Afficher les détails des séances terminées
    if (seancesTerminees.length > 0) {
      console.log('\n📋 Détails des séances terminées:');
      seancesTerminees.forEach((seance, index) => {
        console.log(`\n--- Séance ${index + 1} ---`);
        console.log(`ID: ${seance._id}`);
        console.log(`Nom: ${seance.nom}`);
        console.log(`Date: ${seance.date}`);
        console.log(`En cours: ${seance.enCours}`);
        console.log(`Exercices: ${seance.exercices.length}`);
        
        seance.exercices.forEach((ex, exIndex) => {
          console.log(`  Exercice ${exIndex + 1}: ${ex.nom}`);
          console.log(`    Nombre de séries: ${ex.nombreSeries}`);
          console.log(`    Durée: ${ex.duree}s`);
          console.log(`    Temps de repos: ${ex.tempsRepos}s`);
        });
      });
    } else {
      console.log('\n❌ Aucune séance terminée trouvée');
      console.log('💡 Pour tester le dashboard, vous devez d\'abord terminer une séance');
    }
    
    // Calculer les statistiques comme le dashboard
    const totalSeances = seancesTerminees.length;
    const totalExercices = seancesTerminees.reduce((total, seance) => total + seance.exercices.length, 0);
    const dureeTotaleMinutes = totalExercices * 5; // 5 minutes par exercice
    const heures = Math.floor(dureeTotaleMinutes / 60);
    const minutes = dureeTotaleMinutes % 60;
    const dureeFormatee = `${heures}h ${minutes}m`;
    
    console.log('\n📈 Statistiques calculées:');
    console.log(`Total séances: ${totalSeances}`);
    console.log(`Total exercices: ${totalExercices}`);
    console.log(`Durée totale: ${dureeFormatee}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    mongoose.connection.close();
  }
}

testDashboard();
