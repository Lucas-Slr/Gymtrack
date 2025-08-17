const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gymtrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Données de test pour différentes dates
const seancesTest = [
  {
    nom: 'Full Body',
    date: new Date('2024-01-15'),
    exercices: [
      { nom: 'Squats', duree: 60, nombreSeries: 3, tempsRepos: 90 },
      { nom: 'Développé couché', duree: 45, nombreSeries: 3, tempsRepos: 90 },
      { nom: 'Tractions', duree: 30, nombreSeries: 3, tempsRepos: 60 },
      { nom: 'Soulevé de terre', duree: 60, nombreSeries: 3, tempsRepos: 120 }
    ],
    enCours: false
  },
  {
    nom: 'Push',
    date: new Date('2024-01-18'),
    exercices: [
      { nom: 'Développé couché', duree: 45, nombreSeries: 4, tempsRepos: 90 },
      { nom: 'Développé militaire', duree: 40, nombreSeries: 3, tempsRepos: 60 },
      { nom: 'Dips', duree: 30, nombreSeries: 3, tempsRepos: 60 },
      { nom: 'Extensions triceps', duree: 35, nombreSeries: 3, tempsRepos: 45 }
    ],
    enCours: false
  },
  {
    nom: 'Pull',
    date: new Date('2024-01-20'),
    exercices: [
      { nom: 'Tractions', duree: 30, nombreSeries: 4, tempsRepos: 60 },
      { nom: 'Rowing haltère', duree: 45, nombreSeries: 3, tempsRepos: 60 },
      { nom: 'Curl biceps', duree: 30, nombreSeries: 3, tempsRepos: 45 },
      { nom: 'Face pulls', duree: 25, nombreSeries: 3, tempsRepos: 45 }
    ],
    enCours: false
  },
  {
    nom: 'Legs',
    date: new Date('2024-02-05'),
    exercices: [
      { nom: 'Squats', duree: 60, nombreSeries: 4, tempsRepos: 120 },
      { nom: 'Presse à cuisses', duree: 45, nombreSeries: 3, tempsRepos: 90 },
      { nom: 'Extensions quadriceps', duree: 35, nombreSeries: 3, tempsRepos: 60 },
      { nom: 'Flexions ischio-jambiers', duree: 40, nombreSeries: 3, tempsRepos: 60 }
    ],
    enCours: false
  },
  {
    nom: 'Cardio',
    date: new Date('2024-02-10'),
    exercices: [
      { nom: 'Course à pied', duree: 1800, nombreSeries: 1, tempsRepos: 0 },
      { nom: 'Rameur', duree: 900, nombreSeries: 1, tempsRepos: 0 },
      { nom: 'Vélo stationnaire', duree: 1200, nombreSeries: 1, tempsRepos: 0 }
    ],
    enCours: false
  }
];

async function ajouterSeancesTest() {
  try {
    console.log('🔍 Ajout de séances de test...');
    
    // Récupérer le premier utilisateur
    const user = await User.findOne();
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`👤 Utilisateur trouvé: ${user.email} (ID: ${user._id})`);
    
    // Ajouter les séances de test avec l'userId
    const seancesAvecUserId = seancesTest.map(seance => ({
      ...seance,
      userId: user._id
    }));
    
    const seancesAjoutees = await Seance.insertMany(seancesAvecUserId);
    console.log(`✅ ${seancesAjoutees.length} séances de test ajoutées avec succès`);
    
    // Afficher un résumé
    const totalSeances = await Seance.countDocuments({ userId: user._id });
    const seancesTerminees = await Seance.countDocuments({ userId: user._id, enCours: false });
    const seancesEnCours = await Seance.countDocuments({ userId: user._id, enCours: true });
    
    console.log('\n📊 Résumé:');
    console.log(`- Total séances: ${totalSeances}`);
    console.log(`- Séances terminées: ${seancesTerminees}`);
    console.log(`- Séances en cours: ${seancesEnCours}`);
    
    // Afficher les séances ajoutées
    console.log('\n📋 Séances ajoutées:');
    seancesAjoutees.forEach((seance, index) => {
      console.log(`${index + 1}. ${seance.nom} (${seance.date.toLocaleDateString()}) - ${seance.exercices.length} exercices`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des séances:', error);
  } finally {
    mongoose.connection.close();
  }
}

ajouterSeancesTest();
