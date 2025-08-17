require('dotenv').config();
const mongoose = require('mongoose');
const Seance = require('../models/Seance');

// Configuration MongoDB depuis .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymtrack';

async function testSeancesEnregistrees() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    console.log(`🔗 URI: ${MONGODB_URI}`);

    // Récupérer toutes les séances pour voir leur structure
    const toutesLesSeances = await Seance.find({});
    console.log(`📊 Total des séances en base: ${toutesLesSeances.length}`);

    // Afficher les détails de chaque séance
    toutesLesSeances.forEach((seance, index) => {
      console.log(`\n--- Séance ${index + 1} ---`);
      console.log(`ID: ${seance._id}`);
      console.log(`Nom: ${seance.nom}`);
      console.log(`En cours: ${seance.enCours}`);
      console.log(`Enregistrée: ${seance.enregistree}`);
      console.log(`User ID: ${seance.userId}`);
      console.log(`Date: ${seance.date}`);
      console.log(`Exercices: ${seance.exercices.length}`);
    });

    // Rechercher spécifiquement les séances enregistrées
    const seancesEnregistrees = await Seance.find({ enregistree: true });
    console.log(`\n🎯 Séances enregistrées trouvées: ${seancesEnregistrees.length}`);

    if (seancesEnregistrees.length > 0) {
      seancesEnregistrees.forEach((seance, index) => {
        console.log(`\n--- Séance enregistrée ${index + 1} ---`);
        console.log(`ID: ${seance._id}`);
        console.log(`Nom: ${seance.nom}`);
        console.log(`User ID: ${seance.userId}`);
      });
    } else {
      console.log('❌ Aucune séance enregistrée trouvée');
      
      // Vérifier s'il y a des séances avec enregistree: false
      const seancesNonEnregistrees = await Seance.find({ enregistree: false });
      console.log(`📝 Séances non enregistrées: ${seancesNonEnregistrees.length}`);
      
      // Vérifier s'il y a des séances sans le champ enregistree
      const seancesSansChamp = await Seance.find({ enregistree: { $exists: false } });
      console.log(`❓ Séances sans champ enregistree: ${seancesSansChamp.length}`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le test
testSeancesEnregistrees();
