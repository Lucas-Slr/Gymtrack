const express = require('express');
const router = express.Router();
const Seance = require('../models/Seance');
const { authenticateToken } = require('../middleware/auth');

// Route POST pour créer une nouvelle séance
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nom, exercices, enregistree } = req.body;
    
    // Validation des champs requis
    if (!nom) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la séance est requis',
        errors: [{ field: 'nom', message: 'Le nom de la séance est requis' }]
      });
    }
    
    const nouvelleSeance = new Seance({
      nom,
      exercices,
      enCours: true,
      enregistree: enregistree || false, // ajouter le champ enregistree
      userId: req.user._id
    });
    const seanceCreee = await nouvelleSeance.save();
    res.status(201).json({
      message: 'Séance créée avec succès',
      seance: seanceCreee
    });
  } catch (error) {
    console.error('Erreur lors de la création de la séance:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la séance', error: error.message });
  }
});

// Route GET pour récupérer toutes les séances
router.get('/', authenticateToken, async (req, res) => {
  try {
    const seances = await Seance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(seances);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des séances', error });
  }
});

// Route GET pour récupérer les statistiques générales
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Route /stats appelée pour utilisateur:', req.user._id);
    
    const seances = await Seance.find({ userId: req.user._id, enCours: false }); // Seulement les séances terminées de l'utilisateur
    console.log(`📊 Séances trouvées: ${seances.length}`);
    
    const totalSeances = seances.length;
    const totalExercices = seances.reduce((total, seance) => total + seance.exercices.length, 0);
    
    // Calculer la durée totale (estimation basée sur le nombre d'exercices)
    // En moyenne, un exercice prend 5 minutes (échauffement + séries + repos)
    const dureeTotaleMinutes = totalExercices * 5;
    const heures = Math.floor(dureeTotaleMinutes / 60);
    const minutes = dureeTotaleMinutes % 60;
    const dureeFormatee = `${heures}h ${minutes}m`;

    const result = {
      totalSeances,
      totalExercices,
      dureeTotale: dureeFormatee,
      dureeMinutes: dureeTotaleMinutes
    };
    
    console.log(`📈 Statistiques calculées:`, result);
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur dans /stats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
});

// Route GET pour récupérer les données du graphique mensuel
router.get('/stats/mensuel', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Route /stats/mensuel appelée pour utilisateur:', req.user._id);
    
    const currentYear = new Date().getFullYear();
    const statsMensuelles = [];

    for (let mois = 0; mois < 12; mois++) {
      const debutMois = new Date(currentYear, mois, 1);
      const finMois = new Date(currentYear, mois + 1, 0, 23, 59, 59);

      const seancesDuMois = await Seance.find({
        userId: req.user._id,
        date: {
          $gte: debutMois,
          $lte: finMois
        },
        enCours: false
      });

      statsMensuelles.push({
        mois: mois + 1,
        nombreSeances: seancesDuMois.length
      });
    }

    console.log('📊 Statistiques mensuelles calculées:', statsMensuelles);
    res.json(statsMensuelles);
  } catch (error) {
    console.error('❌ Erreur dans /stats/mensuel:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques mensuelles', error: error.message });
  }
});

// Route GET pour récupérer les séances récentes
router.get('/recentes', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Route /recentes appelée pour utilisateur:', req.user._id);
    
    const seancesRecentes = await Seance.find({ userId: req.user._id, enCours: false })
      .sort({ date: -1 })
      .limit(5);
    
    console.log(`📊 Séances récentes trouvées: ${seancesRecentes.length}`);
    res.json(seancesRecentes);
  } catch (error) {
    console.error('❌ Erreur dans /recentes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des séances récentes', error: error.message });
  }
});

// Route GET pour récupérer la séance en cours
router.get('/encours', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Recherche séance en cours pour utilisateur:', req.user._id);
    const seanceEnCours = await Seance.findOne({ userId: req.user._id, enCours: true }).sort({ date: -1 });
    console.log('📊 Séance en cours trouvée:', seanceEnCours ? 'Oui' : 'Non');
    res.json(seanceEnCours);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la séance en cours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la séance en cours', error: error.message });
  }
});

// Route GET pour récupérer les séances enregistrées
router.get('/enregistrees', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Route /enregistrees appelée pour utilisateur:', req.user._id);
    
    const seancesEnregistrees = await Seance.find({ 
      userId: req.user._id, 
      enregistree: true 
    }).sort({ date: -1 });
    
    console.log(`📊 Séances enregistrées trouvées: ${seancesEnregistrees.length}`);
    res.json(seancesEnregistrees);
  } catch (error) {
    console.error('❌ Erreur dans /enregistrees:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des séances enregistrées', error: error.message });
  }
});

// Route GET pour récupérer une séance par ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const seance = await Seance.findById(id);
    
    if (!seance) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    // Vérifier que l'utilisateur possède la séance
    if (seance.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(seance);
  } catch (error) {
    console.error('Erreur lors de la récupération de la séance:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la séance', error: error.message });
  }
});

// Route PATCH pour terminer une séance
router.patch('/:id/terminer', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const seanceTerminee = await Seance.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { enCours: false }, 
      { new: true }
    );
    res.json(seanceTerminee);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la terminaison de la séance', error });
  }
});

// Route PUT pour mettre à jour une séance
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, exercices, enCours, enregistree } = req.body;
    
    const seance = await Seance.findById(id);
    
    if (!seance) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    // Vérifier que l'utilisateur possède la séance
    if (seance.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const seanceModifiee = await Seance.findByIdAndUpdate(
      id,
      { nom, exercices, enCours, enregistree },
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Séance mise à jour avec succès',
      seance: seanceModifiee
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la séance:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la séance', error: error.message });
  }
});

// Route DELETE pour supprimer une séance
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const seance = await Seance.findById(id);
    
    if (!seance) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }
    
    // Vérifier que l'utilisateur possède la séance
    if (seance.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    await Seance.findByIdAndDelete(id);
    
    res.json({ message: 'Séance supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la séance', error });
  }
});

// Route PATCH pour lancer une séance enregistrée (créer une nouvelle séance en cours)
router.patch('/:id/lancer', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Lancement séance enregistrée:', id, 'pour utilisateur:', req.user._id);
    
    // Récupérer la séance enregistrée
    const seanceEnregistree = await Seance.findOne({ 
      _id: id, 
      userId: req.user._id, 
      enregistree: true 
    });
    
    if (!seanceEnregistree) {
      return res.status(404).json({ message: 'Séance enregistrée non trouvée' });
    }
    
    // Vérifier qu'il n'y a pas déjà une séance en cours
    const seanceEnCours = await Seance.findOne({ 
      userId: req.user._id, 
      enCours: true 
    });
    
    if (seanceEnCours) {
      return res.status(400).json({ message: 'Une séance est déjà en cours. Terminez-la d\'abord.' });
    }
    
    // Créer une nouvelle séance basée sur la séance enregistrée
    const nouvelleSeance = new Seance({
      nom: seanceEnregistree.nom,
      exercices: seanceEnregistree.exercices,
      enCours: true,
      enregistree: false, // La nouvelle séance n'est pas enregistrée par défaut
      userId: req.user._id
    });
    
    const seanceCreee = await nouvelleSeance.save();
    console.log('✅ Nouvelle séance créée à partir de la séance enregistrée:', seanceCreee._id);
    
    res.json(seanceCreee);
  } catch (error) {
    console.error('❌ Erreur lors du lancement de la séance enregistrée:', error);
    res.status(500).json({ message: 'Erreur lors du lancement de la séance', error: error.message });
  }
});

// Route PATCH pour désenregistrer une séance (retirer de la liste des séances enregistrées)
router.patch('/:id/desenregistrer', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Désenregistrement séance:', id, 'pour utilisateur:', req.user._id);
    
    const seanceModifiee = await Seance.findOneAndUpdate(
      { _id: id, userId: req.user._id, enregistree: true },
      { enregistree: false },
      { new: true }
    );
    
    if (!seanceModifiee) {
      return res.status(404).json({ message: 'Séance enregistrée non trouvée' });
    }
    
    console.log('✅ Séance désenregistrée:', seanceModifiee._id);
    res.json({ message: 'Séance retirée de la liste des séances enregistrées' });
  } catch (error) {
    console.error('❌ Erreur lors du désenregistrement:', error);
    res.status(500).json({ message: 'Erreur lors du désenregistrement de la séance', error: error.message });
  }
});

module.exports = router;