#!/bin/bash

echo "🧪 Démarrage des tests GymTrack..."
echo "=================================="

# Tests Backend
echo "📦 Tests Backend..."
cd backend
npm test -- --coverage --watchAll=false
BACKEND_EXIT_CODE=$?

# Tests Frontend
echo "🎨 Tests Frontend..."
cd ../Frontend
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
FRONTEND_EXIT_CODE=$?

echo "=================================="
echo "📊 Résumé des tests :"

if [ $BACKEND_EXIT_CODE -eq 0 ]; then
    echo "✅ Tests Backend : SUCCÈS"
else
    echo "❌ Tests Backend : ÉCHEC"
fi

if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo "✅ Tests Frontend : SUCCÈS"
else
    echo "❌ Tests Frontend : ÉCHEC"
fi

echo ""
echo "📈 Rapports de couverture générés :"
echo "- Backend : backend/coverage/index.html"
echo "- Frontend : Frontend/coverage/frontend/index.html"

# Vérifier si tous les tests ont réussi
if [ $BACKEND_EXIT_CODE -eq 0 ] && [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "🎉 Tous les tests ont réussi !"
    exit 0
else
    echo ""
    echo "💥 Certains tests ont échoué."
    exit 1
fi
