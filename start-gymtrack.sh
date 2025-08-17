#!/bin/bash

echo "========================================"
echo "    DEMARRAGE DE GYMTRACK"
echo "========================================"
echo ""
echo "Ce script va démarrer l'application GymTrack"
echo "avec Docker Compose."
echo ""
echo "Assurez-vous que Docker est en cours d'exécution."
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "ERREUR: Docker n'est pas installé."
    echo "Veuillez installer Docker depuis https://docs.docker.com/get-docker/"
    exit 1
fi

# Vérifier si Docker est en cours d'exécution
if ! docker info &> /dev/null; then
    echo "ERREUR: Docker n'est pas en cours d'exécution."
    echo "Veuillez démarrer Docker et réessayer."
    exit 1
fi

echo "Docker détecté. Démarrage de l'application..."
echo ""

# Construire et démarrer les conteneurs
docker-compose up --build -d

if [ $? -ne 0 ]; then
    echo "ERREUR: Impossible de démarrer les conteneurs."
    exit 1
fi

echo ""
echo "========================================"
echo "    APPLICATION DEMARRÉE AVEC SUCCÈS !"
echo "========================================"
echo ""
echo "L'application est maintenant accessible :"
echo "- Frontend: http://localhost"
echo "- Backend API: http://localhost:5000"
echo "- MongoDB: localhost:27017"
echo ""
echo "Comptes de test disponibles :"
echo "- Email: test@example.com"
echo "- Mot de passe: password"
echo ""
echo "Pour arrêter l'application, exécutez : ./stop-gymtrack.sh"
echo ""
