#!/bin/bash

echo "========================================"
echo "    ARRÊT DE GYMTRACK"
echo "========================================"
echo ""
echo "Ce script va arrêter l'application GymTrack."
echo ""

# Arrêter les conteneurs
docker-compose down

if [ $? -ne 0 ]; then
    echo "ERREUR: Impossible d'arrêter les conteneurs."
    exit 1
fi

echo ""
echo "========================================"
echo "    APPLICATION ARRÊTÉE AVEC SUCCÈS !"
echo "========================================"
echo ""
echo "Les conteneurs ont été arrêtés."
echo "Pour redémarrer l'application, exécutez : ./start-gymtrack.sh"
echo ""
