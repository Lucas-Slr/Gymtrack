const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function terminerSeanceTest() {
  try {
    console.log('🔍 Recherche d\'une séance à terminer...');
    
    // Récupérer le premier utilisateur
    const user = await User.findOne();
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`👤 Utilisateur trouvé: ${user.email} (ID: ${user._id})`);
    
    // Récupérer une séance en cours
    const seanceEnCours = await Seance.findOne({ userId: user._id, enCours: true });
    
    if (!seanceEnCours) {
      console.log('❌ Aucune séance en cours trouvée');
      console.log('💡 Création d\'une séance de test terminée...');
      
      // Créer une séance terminée de test
      const seanceTerminee = new Seance({
        nom: 'Séance Test Terminée',
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
        enCours: false, // Séance terminée
        userId: user._id,
        date: new Date() // Date d'aujourd'hui
      });
      
      const seanceCreee = await seanceTerminee.save();
      console.log('✅ Séance terminée de test créée:', seanceCreee._id);
      
    } else {
      console.log('🎯 Séance en cours trouvée:', seanceEnCours.nom);
      console.log('🔄 Terminaison de la séance...');
      
      // Terminer la séance
      seanceEnCours.enCours = false;
      await seanceEnCours.save();
      
      console.log('✅ Séance terminée avec succès');
    }
    
    // Vérifier les séances terminées
    const seancesTerminees = await Seance.find({ userId: user._id, enCours: false });
    console.log(`📊 Nombre de séances terminées: ${seancesTerminees.length}`);
    
    if (seancesTerminees.length > 0) {
      console.log('\n📋 Séances terminées:');
      seancesTerminees.forEach((seance, index) => {
        console.log(`${index + 1}. ${seance.nom} (${seance.date.toLocaleDateString()})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la terminaison:', error);
  } finally {
    mongoose.connection.close();
  }
}

terminerSeanceTest();
