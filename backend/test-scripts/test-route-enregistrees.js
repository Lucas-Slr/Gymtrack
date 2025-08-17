const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const USER_ID = '689a0f4a521f1cdaa6cfde6c';

async function testRouteEnregistrees() {
  try {
    console.log('🔍 Test de la route /seance/enregistrees');
    
    // D'abord, on va essayer de se connecter pour obtenir un token
    console.log('📝 Tentative de connexion...');
    
    // Note: Vous devrez remplacer ces identifiants par ceux de votre utilisateur
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com', // Remplacez par votre email
      password: 'password123'     // Remplacez par votre mot de passe
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenu:', token.substring(0, 20) + '...');
    
    // Test de la route /enregistrees avec le token
    console.log('🔍 Test de GET /seance/enregistrees...');
    
    const response = await axios.get(`${BASE_URL}/seance/enregistrees`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Réponse reçue:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    console.log('Nombre de séances:', response.data.length);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Exécuter le test
testRouteEnregistrees();

