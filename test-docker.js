const axios = require('axios');

async function testDockerSetup() {
  console.log('🧪 Test de l\'installation Docker GymTrack');
  console.log('==========================================\n');

  const baseUrl = 'http://localhost:5000';
  const frontendUrl = 'http://localhost';

  try {
    // Test 1: Vérifier que le backend répond
    console.log('1️⃣ Test du backend...');
    const backendResponse = await axios.get(`${baseUrl}/`);
    console.log('✅ Backend accessible:', backendResponse.data);

    // Test 2: Vérifier que l'API d'authentification fonctionne
    console.log('\n2️⃣ Test de l\'API d\'authentification...');
    const authResponse = await axios.post(`${baseUrl}/auth/login`, {
      email: 'test@example.com',
      password: 'password'
    });
    console.log('✅ Authentification réussie:', authResponse.data.success);

    // Test 3: Vérifier que le frontend est accessible
    console.log('\n3️⃣ Test du frontend...');
    const frontendResponse = await axios.get(frontendUrl);
    console.log('✅ Frontend accessible (status:', frontendResponse.status, ')');

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n📱 L\'application est prête à être utilisée :');
    console.log('- Frontend: http://localhost');
    console.log('- Backend: http://localhost:5000');
    console.log('- Compte test: test@example.com / password');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solutions possibles :');
      console.log('1. Vérifiez que Docker Desktop est en cours d\'exécution');
      console.log('2. Relancez l\'application avec : docker-compose up --build -d');
      console.log('3. Attendez 2-3 minutes que tous les services démarrent');
    }
  }
}

// Exécuter le test
testDockerSetup();
