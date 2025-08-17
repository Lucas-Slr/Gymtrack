const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('Test de l\'API GymTrack...\n');

    // 1. Test de la route de base
    console.log('1. Test de la route de base:');
    const baseResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Route de base:', baseResponse.data);

    // 2. Test de connexion
    console.log('\n2. Test de connexion:');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Connexion réussie');
    const token = loginResponse.data.data.accessToken;

    // 3. Test des statistiques
    console.log('\n3. Test des statistiques:');
    const statsResponse = await axios.get(`${BASE_URL}/seance/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Statistiques:', statsResponse.data);

    // 4. Test des statistiques mensuelles
    console.log('\n4. Test des statistiques mensuelles:');
    const monthlyStatsResponse = await axios.get(`${BASE_URL}/seance/stats/mensuel`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Statistiques mensuelles:', monthlyStatsResponse.data);

    // 5. Test des séances récentes
    console.log('\n5. Test des séances récentes:');
    const recentSeancesResponse = await axios.get(`${BASE_URL}/seance/recentes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Séances récentes:', recentSeancesResponse.data.length, 'séances');

    console.log('\n🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

testAPI();
