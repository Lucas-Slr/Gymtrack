require('dotenv').config();
const mongoose = require('mongoose');
const Seance = require('../models/Seance');

// Configuration MongoDB depuis .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymtrack';

async function creerSeanceEnregistree() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Utiliser l'ID de l'utilisateur actuel (celui qui a les séances récentes)
    const userId = '689a0f4a521f1cdaa6cfde6c';
    console.log(`👤 Utilisation du User ID: ${userId}`);

    // Créer une nouvelle séance enregistrée
    const nouvelleSeance = new Seance({
      nom: 'Séance Bras Enregistrée',
      exercices: [
        {
          nom: 'Pompes',
          duree: 60,
          nombreSeries: 3,
          tempsRepos: 90
        },
        {
          nom: 'Tractions',
          duree: 45,
          nombreSeries: 4,
          tempsRepos: 60
        }
      ],
      enCours: false,
      enregistree: true, // Important : marquer comme enregistrée
      userId: userId,
      date: new Date()
    });

    const seanceCreee = await nouvelleSeance.save();
    console.log('✅ Séance enregistrée créée avec succès:');
    console.log(`ID: ${seanceCreee._id}`);
    console.log(`Nom: ${seanceCreee.nom}`);
    console.log(`Enregistrée: ${seanceCreee.enregistree}`);
    console.log(`User ID: ${seanceCreee.userId}`);

    // Vérifier qu'elle est bien trouvée pour cet utilisateur
    const seancesEnregistrees = await Seance.find({ 
      enregistree: true, 
      userId: userId 
    });
    console.log(`\n🎯 Séances enregistrées pour l'utilisateur ${userId}: ${seancesEnregistrees.length}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
creerSeanceEnregistree();
