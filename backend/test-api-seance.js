const axios = require('axios');

async function testCreateSeanceAPI() {
  try {
    console.log('🔍 Test de l\'API de création de séance...');
    
    // D'abord, se connecter pour obtenir un token
    const loginResponse = await axios.post('http://localhost:5000/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.accessToken;
    console.log('✅ Token obtenu:', token.substring(0, 20) + '...');
    
    // Données de test pour une séance
    const seanceData = {
      nom: 'Séance Test API',
      exercices: [
        {
          nom: 'Pompes',
          duree: 60,
          nombreSeries: 3,
          tempsRepos: 90
        },
        {
          nom: 'Squats',
          duree: 45,
          nombreSeries: 4,
          tempsRepos: 60
        }
      ]
    };
    
    console.log('📝 Données envoyées:', JSON.stringify(seanceData, null, 2));
    
    // Créer la séance via l'API
    const createResponse = await axios.post('http://localhost:5000/seance', seanceData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Séance créée via API:', createResponse.data);
    
  } catch (error) {
    console.error('❌ Erreur lors du test API:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : error.message);
  }
}

testCreateSeanceAPI();
