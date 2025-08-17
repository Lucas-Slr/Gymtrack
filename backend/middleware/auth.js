const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'accès requis' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé ou inactif' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expiré' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la vérification du token' 
    });
  }
};

// Middleware pour vérifier le token de rafraîchissement
const authenticateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de rafraîchissement requis' 
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé ou inactif' 
      });
    }

    // Vérifier si le token de rafraîchissement existe et n'est pas expiré
    if (!user.hasValidToken(refreshToken)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de rafraîchissement invalide ou expiré' 
      });
    }

    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de rafraîchissement expiré' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Token de rafraîchissement invalide' 
    });
  }
};

// Middleware pour vérifier si l'utilisateur n'est PAS connecté (pour les pages login/register)
const requireGuest = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password -refreshTokens');

      if (user && user.isActive) {
        return res.status(403).json({ 
          success: false, 
          message: 'Vous êtes déjà connecté' 
        });
      }
    }

    next();
  } catch (error) {
    // Si le token est invalide, on continue (l'utilisateur n'est pas connecté)
    next();
  }
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
  requireGuest
}; 