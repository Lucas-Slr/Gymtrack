const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, authenticateRefreshToken, requireGuest } = require('../middleware/auth');

const router = express.Router();

// Validation pour l'inscription
const registerValidation = [
  body('nom').trim().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  body('prenom').trim().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('age').isInt({ min: 13, max: 120 }).withMessage('L\'âge doit être entre 13 et 120 ans'),
  body('poids').isFloat({ min: 30, max: 300 }).withMessage('Le poids doit être entre 30 et 300 kg'),
  body('taille').isFloat({ min: 100, max: 250 }).withMessage('La taille doit être entre 100 et 250 cm')
];

// Validation pour la connexion
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
];

// Fonction pour générer les tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Token d'accès expire en 15 minutes
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '72h' } // Token de rafraîchissement expire en 72 heures
  );

  return { accessToken, refreshToken };
};

// Route d'inscription
router.post('/register', requireGuest, registerValidation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { nom, prenom, email, password, age, poids, taille } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      nom,
      prenom,
      email,
      password,
      age,
      poids,
      taille
    });

    await user.save();

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Ajouter le token de rafraîchissement à l'utilisateur
    try {
      await user.addRefreshToken(refreshToken);
    } catch (tokenError) {
      console.error('Erreur lors de l\'ajout du token de rafraîchissement:', tokenError);
      // On continue même si l'ajout du token échoue
    }

    // Retourner la réponse sans le mot de passe
    const userResponse = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      age: user.age,
      poids: user.poids,
      taille: user.taille,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
});

// Route de connexion
router.post('/login', requireGuest, loginValidation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Nettoyer les tokens expirés
    await user.cleanExpiredTokens();

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Ajouter le token de rafraîchissement à l'utilisateur
    await user.addRefreshToken(refreshToken);

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Retourner la réponse sans le mot de passe
    const userResponse = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      age: user.age,
      poids: user.poids,
      taille: user.taille,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
});

// Route de rafraîchissement de token
router.post('/refresh', authenticateRefreshToken, async (req, res) => {
  try {
    const user = req.user;
    const oldRefreshToken = req.refreshToken;

    // Supprimer l'ancien token de rafraîchissement
    await user.removeRefreshToken(oldRefreshToken);

    // Générer de nouveaux tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Ajouter le nouveau token de rafraîchissement
    await user.addRefreshToken(refreshToken);

    res.json({
      success: true,
      message: 'Token rafraîchi avec succès',
      data: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement du token'
    });
  }
});

// Route de déconnexion
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Supprimer le token de rafraîchissement (si on l'a)
    if (req.body.refreshToken) {
      await user.removeRefreshToken(req.body.refreshToken);
    }

    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion'
    });
  }
});

// Route pour obtenir le profil utilisateur
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          age: user.age,
          poids: user.poids,
          taille: user.taille,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// Route pour vérifier si l'utilisateur est connecté
router.get('/verify', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Token valide',
    data: {
      user: {
        _id: req.user._id,
        nom: req.user.nom,
        prenom: req.user.prenom,
        email: req.user.email
      }
    }
  });
});

// Route pour mettre à jour le profil utilisateur
router.put('/profile', authenticateToken, [
  body('nom').optional().trim().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  body('prenom').optional().trim().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email invalide'),
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('L\'âge doit être entre 13 et 120 ans'),
  body('poids').optional().isFloat({ min: 30, max: 300 }).withMessage('Le poids doit être entre 30 et 300 kg'),
  body('taille').optional().isFloat({ min: 100, max: 250 }).withMessage('La taille doit être entre 100 et 250 cm'),
  body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères'),
  body('aboutMe').optional().trim().isLength({ max: 500 }).withMessage('La description ne peut pas dépasser 500 caractères')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const user = req.user;
    const updateData = req.body;

    // Vérifier si l'email existe déjà (si modifié)
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }
    }

    // Vérifier si le nom d'utilisateur existe déjà (si modifié)
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await User.findOne({ username: updateData.username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Ce nom d\'utilisateur est déjà pris'
        });
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});

module.exports = router; 