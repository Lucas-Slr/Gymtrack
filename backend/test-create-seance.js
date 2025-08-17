const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testCreateSeance() {
  try {
    console.log('🔍 Test de création de séance...');
    
    // Récupérer le premier utilisateur
    const user = await User.findOne();
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`👤 Utilisateur trouvé: ${user.email} (ID: ${user._id})`);
    
    // Données de test pour une séance
    const seanceData = {
      nom: 'Séance Test',
      exercices: [
        {
          nom: 'Pompes',
          duree: 60,
          nombreSeries: 3,
          tempsRepos: 90
        },
        {
          nom: 'Squats',
          duree: 45,
          nombreSeries: 4,
          tempsRepos: 60
        }
      ],
      enCours: true,
      userId: user._id
    };
    
    console.log('📝 Données de la séance:', JSON.stringify(seanceData, null, 2));
    
    // Créer la séance
    const nouvelleSeance = new Seance(seanceData);
    const seanceCreee = await nouvelleSeance.save();
    
    console.log('✅ Séance créée avec succès:', seanceCreee);
    
    // Vérifier que la séance a été sauvegardée
    const seanceVerifiee = await Seance.findById(seanceCreee._id);
    console.log('🔍 Séance vérifiée:', seanceVerifiee);
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    mongoose.connection.close();
  }
}

testCreateSeance();
