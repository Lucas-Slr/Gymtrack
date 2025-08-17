const mongoose = require('mongoose');

const ExerciceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  duree: { type: Number, required: true }, // durée en secondes
  nombreSeries: { type: Number, required: true },
  tempsRepos: { type: Number, required: true }, // temps de repos en secondes
});

const SeanceSchema = new mongoose.Schema({
  nom: { type: String, required: true }, // changé de 'titre' à 'nom' pour correspondre au frontend
  date: { type: Date, default: Date.now },
  exercices: [ExerciceSchema],
  enCours: { type: Boolean, default: true },
  enregistree: { type: Boolean, default: false }, // nouvelle propriété pour les séances enregistrées
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Seance', SeanceSchema);