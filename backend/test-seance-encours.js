const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testSeanceEnCours() {
  try {
    console.log('🔍 Test des séances en cours...');
    
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
    
    toutesSeances.forEach((seance, index) => {
      console.log(`\n--- Séance ${index + 1} ---`);
      console.log(`ID: ${seance._id}`);
      console.log(`Nom: ${seance.nom}`);
      console.log(`En cours: ${seance.enCours}`);
      console.log(`Date: ${seance.date}`);
      console.log(`Exercices: ${seance.exercices.length}`);
      
      seance.exercices.forEach((ex, exIndex) => {
        console.log(`  Exercice ${exIndex + 1}: ${ex.nom}`);
        console.log(`    Nombre de séries: ${ex.nombreSeries}`);
        console.log(`    Durée: ${ex.duree}s`);
        console.log(`    Temps de repos: ${ex.tempsRepos}s`);
      });
    });
    
    // Récupérer spécifiquement les séances en cours
    const seancesEnCours = await Seance.find({ userId: user._id, enCours: true });
    console.log(`\n🎯 Séances en cours: ${seancesEnCours.length}`);
    
    if (seancesEnCours.length > 0) {
      const seanceEnCours = seancesEnCours[0];
      console.log('\n✅ Séance en cours trouvée:');
      console.log(JSON.stringify(seanceEnCours, null, 2));
    } else {
      console.log('❌ Aucune séance en cours trouvée');
      
      // Créer une séance de test si aucune n'existe
      console.log('\n🔧 Création d\'une séance de test...');
      const seanceTest = new Seance({
        nom: 'Séance Test',
        exercices: [
          {
            nom: 'Squatte',
            duree: 60,
            nombreSeries: 3,
            tempsRepos: 90
          },
          {
            nom: 'Presse incliné',
            duree: 45,
            nombreSeries: 4,
            tempsRepos: 60
          }
        ],
        enCours: true,
        userId: user._id
      });
      
      const seanceCreee = await seanceTest.save();
      console.log('✅ Séance de test créée:', seanceCreee._id);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSeanceEnCours();
