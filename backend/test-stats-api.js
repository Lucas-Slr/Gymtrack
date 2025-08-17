const axios = require('axios');

async function testStatsAPI() {
  try {
    console.log('🧪 Test de l\'API /stats...');
    console.log('==========================');
    
    const response = await axios.get('http://localhost:5000/seance/stats');
    
    console.log('✅ Réponse reçue:');
    console.log(`Status: ${response.status}`);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.totalSeances === 0) {
      console.log('\n⚠️  Le dashboard affiche 0 séances');
      console.log('Cela peut être dû à:');
      console.log('1. Le serveur backend n\'a pas été redémarré');
      console.log('2. Les séances n\'ont pas le bon userId');
      console.log('3. Les séances ont enCours: true au lieu de false');
    } else {
      console.log('\n🎉 L\'API fonctionne correctement !');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Le serveur backend n\'est pas démarré. Lance "npm start" dans le dossier backend');
    }
  }
}

testStatsAPI();








