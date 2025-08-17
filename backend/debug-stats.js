const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugStats() {
  try {
    console.log('Débogage de la route /stats...');
    console.log('================================');
    
    // Récupérer le premier utilisateur pour les tests
    const defaultUser = await User.findOne();
    console.log(`1. Utilisateur trouvé: ${defaultUser ? defaultUser.email : 'Aucun'} (ID: ${defaultUser ? defaultUser._id : 'null'})`);
    
    const userId = defaultUser ? defaultUser._id : null;
    console.log(`2. userId utilisé: ${userId}`);
    
    // Rechercher les séances
    const seances = await Seance.find({ userId: userId, enCours: false });
    console.log(`3. Séances trouvées: ${seances.length}`);
    
    // Afficher les détails de la requête
    console.log(`4. Requête: { userId: ${userId}, enCours: false }`);
    
    // Vérifier si les séances ont le bon userId
    if (seances.length > 0) {
      console.log('5. Première séance trouvée:');
      console.log(`   - Titre: ${seances[0].titre}`);
      console.log(`   - userId: ${seances[0].userId}`);
      console.log(`   - enCours: ${seances[0].enCours}`);
      console.log(`   - Nombre d'exercices: ${seances[0].exercices.length}`);
    }
    
    // Calculer les statistiques
    const totalSeances = seances.length;
    const totalExercices = seances.reduce((total, seance) => total + seance.exercices.length, 0);
    const dureeTotaleMinutes = totalExercices * 5;
    const heures = Math.floor(dureeTotaleMinutes / 60);
    const minutes = dureeTotaleMinutes % 60;
    const dureeFormatee = `${heures}h ${minutes}m`;
    
    console.log('\n6. Statistiques calculées:');
    console.log(`   - totalSeances: ${totalSeances}`);
    console.log(`   - totalExercices: ${totalExercices}`);
    console.log(`   - dureeTotale: ${dureeFormatee}`);
    console.log(`   - dureeMinutes: ${dureeTotaleMinutes}`);
    
    // Test avec une requête sans userId
    const seancesSansUser = await Seance.find({ enCours: false });
    console.log(`\n7. Séances sans filtre userId: ${seancesSansUser.length}`);
    
    // Test avec une requête sans enCours
    const seancesSansEnCours = await Seance.find({ userId: userId });
    console.log(`8. Séances sans filtre enCours: ${seancesSansEnCours.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

debugStats();








