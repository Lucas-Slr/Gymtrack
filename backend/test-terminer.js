const axios = require('axios');

async function testTerminerSeance() {
  try {
    console.log('Test de la route PATCH pour terminer une séance...');
    
    // D'abord, récupérer la séance en cours
    console.log('1. Récupération de la séance en cours...');
    const response = await axios.get('http://localhost:5000/seance/encours');
    console.log('Séance en cours:', response.data);
    
    if (response.data) {
      const seanceId = response.data._id;
      console.log('2. ID de la séance à terminer:', seanceId);
      
      // Tenter de terminer la séance
      console.log('3. Tentative de terminaison de la séance...');
      const terminerResponse = await axios.patch(`http://localhost:5000/seance/${seanceId}/terminer`, {
        enCours: false
      });
      
      console.log('4. Séance terminée avec succès:', terminerResponse.data);
      
      // Vérifier que la séance n'est plus en cours
      console.log('5. Vérification - séance en cours après terminaison...');
      const verificationResponse = await axios.get('http://localhost:5000/seance/encours');
      console.log('Résultat de la vérification:', verificationResponse.data);
    } else {
      console.log('Aucune séance en cours trouvée');
    }
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
  }
}

testTerminerSeance(); 