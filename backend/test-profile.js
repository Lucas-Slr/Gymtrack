const axios = require('axios');

const API_URL = 'http://localhost:5000/auth';

async function testProfileUpdate() {
  try {
    console.log('🧪 Test de mise à jour du profil...\n');

    // 1. Connexion pour obtenir un token
    console.log('1️⃣ Connexion...');
    const loginResponse = await axios.post(`${API_URL}/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    if (!loginResponse.data.success) {
      throw new Error('Échec de la connexion');
    }

    const { accessToken } = loginResponse.data.data;
    console.log('✅ Connexion réussie\n');

    // 2. Mise à jour du profil
    console.log('2️⃣ Mise à jour du profil...');
    const updateData = {
      username: 'testuser123',
      aboutMe: 'Je suis un utilisateur de test passionné de fitness !'
    };

    const updateResponse = await axios.put(`${API_URL}/profile`, updateData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (updateResponse.data.success) {
      console.log('✅ Profil mis à jour avec succès');
      console.log('📊 Données mises à jour:', updateResponse.data.data.user);
    } else {
      console.log('❌ Échec de la mise à jour:', updateResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

// Lancer le test
testProfileUpdate();
