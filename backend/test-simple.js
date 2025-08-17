const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testSimple() {
  try {
    console.log('Test simple des routes de statistiques...\n');

    // Test de la route de base
    console.log('1. Test route de base:');
    const baseResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Serveur répond:', baseResponse.data);

    // Test des statistiques
    console.log('\n2. Test statistiques:');
    const statsResponse = await axios.get(`${BASE_URL}/seance/stats`);
    console.log('✅ Statistiques:', statsResponse.data);

    // Test des statistiques mensuelles
    console.log('\n3. Test statistiques mensuelles:');
    const monthlyResponse = await axios.get(`${BASE_URL}/seance/stats/mensuel`);
    console.log('✅ Statistiques mensuelles:', monthlyResponse.data);

    // Test des séances récentes
    console.log('\n4. Test séances récentes:');
    const recentResponse = await axios.get(`${BASE_URL}/seance/recentes`);
    console.log('✅ Séances récentes:', recentResponse.data.length, 'séances');

    console.log('\n🎉 Tous les tests sont passés !');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testSimple();
