const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères']
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    minlength: [2, 'Le prénom doit contenir au moins 2 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // Permet les valeurs null
    trim: true,
    minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
    maxlength: [30, 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  age: {
    type: Number,
    required: [true, 'L\'âge est requis'],
    min: [13, 'L\'âge minimum est de 13 ans'],
    max: [120, 'L\'âge maximum est de 120 ans']
  },
  poids: {
    type: Number,
    required: [true, 'Le poids est requis'],
    min: [30, 'Le poids minimum est de 30kg'],
    max: [300, 'Le poids maximum est de 300kg']
  },
  taille: {
    type: Number,
    required: [true, 'La taille est requise'],
    min: [100, 'La taille minimum est de 100cm'],
    max: [250, 'La taille maximum est de 250cm']
  },
  aboutMe: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  refreshTokens: [{
    token: String,
    expiresAt: Date
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour nettoyer les tokens expirés
userSchema.methods.cleanExpiredTokens = function() {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(token => token.expiresAt > now);
  return this.save();
};

// Méthode pour ajouter un token de rafraîchissement
userSchema.methods.addRefreshToken = async function(token, expiresIn = '72h') {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 72); // 72 heures
  
  this.refreshTokens.push({
    token,
    expiresAt
  });
  
  return await this.save();
};

// Méthode pour supprimer un token de rafraîchissement
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  return this.save();
};

// Méthode pour vérifier si un token existe
userSchema.methods.hasValidToken = function(token) {
  const now = new Date();
  return this.refreshTokens.some(t => t.token === token && t.expiresAt > now);
};

// Méthode pour obtenir le nom complet
userSchema.methods.getFullName = function() {
  return `${this.prenom} ${this.nom}`;
};

module.exports = mongoose.model('User', userSchema); 