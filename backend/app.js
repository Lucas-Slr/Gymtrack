require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});
app.use(limiter);

// Rate limiting spécifique pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 30, // Plus de tentatives en mode test
  message: {
    success: false,
    message: 'Trop de tentatives d\'authentification, veuillez réessayer plus tard'
  }
});

// Routes
const authRoutes = require('./routes/auth');
const seanceRoutes = require('./routes/seance');

// Routes d'authentification avec rate limiting (désactivé en mode test)
if (process.env.NODE_ENV === 'test') {
  app.use('/auth', authRoutes);
} else {
  app.use('/auth', authLimiter, authRoutes);
}

// Routes protégées
app.use('/seance', seanceRoutes);

// Exemple de route de base
app.get('/', (req, res) => {
  res.send('API GymTrack opérationnelle');
});

// Gestion des erreurs globales
process.on('uncaughtException', (err) => {
  console.error('Erreur non capturée:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Promesse rejetée non gérée:', err);
});

// Export de l'app pour les tests
module.exports = app;
