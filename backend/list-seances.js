const mongoose = require('mongoose');
const Seance = require('./models/Seance');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function listSeances() {
  try {
    console.log('Liste des séances dans la base de données:');
    console.log('==========================================');
    
    const seances = await Seance.find().sort({ date: -1 });
    
    if (seances.length === 0) {
      console.log('Aucune séance trouvée');
    } else {
      seances.forEach((seance, index) => {
        console.log(`${index + 1}. ID: ${seance._id}`);
        console.log(`   Titre: ${seance.titre || 'Sans titre'}`);
        console.log(`   Date: ${seance.date}`);
        console.log(`   En cours: ${seance.enCours}`);
        console.log(`   Exercices: ${seance.exercices.length}`);
        console.log('---');
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

listSeances();

