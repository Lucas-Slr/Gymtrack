Write-Host "🧪 Démarrage des tests GymTrack..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Tests Backend
Write-Host "📦 Tests Backend..." -ForegroundColor Yellow
Set-Location backend
npm test -- --coverage --watchAll=false
$BackendExitCode = $LASTEXITCODE

# Tests Frontend
Write-Host "🎨 Tests Frontend..." -ForegroundColor Yellow
Set-Location ../Frontend
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
$FrontendExitCode = $LASTEXITCODE

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "📊 Résumé des tests :" -ForegroundColor White

if ($BackendExitCode -eq 0) {
    Write-Host "✅ Tests Backend : SUCCÈS" -ForegroundColor Green
} else {
    Write-Host "❌ Tests Backend : ÉCHEC" -ForegroundColor Red
}

if ($FrontendExitCode -eq 0) {
    Write-Host "✅ Tests Frontend : SUCCÈS" -ForegroundColor Green
} else {
    Write-Host "❌ Tests Frontend : ÉCHEC" -ForegroundColor Red
}

Write-Host ""
Write-Host "📈 Rapports de couverture générés :" -ForegroundColor White
Write-Host "- Backend : backend/coverage/index.html" -ForegroundColor Gray
Write-Host "- Frontend : Frontend/coverage/frontend/index.html" -ForegroundColor Gray

# Vérifier si tous les tests ont réussi
if ($BackendExitCode -eq 0 -and $FrontendExitCode -eq 0) {
    Write-Host ""
    Write-Host "🎉 Tous les tests ont réussi !" -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "💥 Certains tests ont échoué." -ForegroundColor Red
    exit 1
}
