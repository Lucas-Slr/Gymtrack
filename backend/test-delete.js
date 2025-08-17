const mongoose = require('mongoose');
const Seance = require('./models/Seance');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testDelete() {
  try {
    const seanceId = '6899f35fbc46f8040a0091b8';
    
    console.log('Test de suppression de la séance:', seanceId);
    
    // Vérifier si la séance existe
    const seance = await Seance.findById(seanceId);
    if (!seance) {
      console.log('❌ Séance non trouvée');
      return;
    }
    
    console.log('✅ Séance trouvée:', {
      _id: seance._id,
      titre: seance.titre,
      date: seance.date,
      exercices: seance.exercices.length
    });
    
    // Tenter la suppression
    const seanceSupprimee = await Seance.findByIdAndDelete(seanceId);
    if (seanceSupprimee) {
      console.log('✅ Séance supprimée avec succès');
    } else {
      console.log('❌ Erreur lors de la suppression');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

testDelete();

