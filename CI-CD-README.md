# CI/CD Pipeline - GymTrack

## Vue d'ensemble

Ce projet utilise GitHub Actions pour automatiser l'intégration continue et le déploiement continu (CI/CD).

## Workflow CI/CD

### Déclencheurs
- **Push** sur la branche `main`
- **Pull Request** vers la branche `main`

### Étapes du pipeline

#### 1. Test Backend
- Installation des dépendances Node.js
- Exécution des tests unitaires
- Vérification de la qualité du code (linting)

#### 2. Test Frontend
- Installation des dépendances Angular/Ionic
- Exécution des tests unitaires
- Build de l'application
- Vérification de la qualité du code (linting)

#### 3. Build Docker
- Construction des images Docker pour le backend et frontend
- Tagging avec le SHA du commit

#### 4. Déploiement Test
- Déploiement automatique sur l'environnement de test
- Vérification de la santé des services

## Configuration

### Variables d'environnement requises
```yaml
# À configurer dans GitHub Secrets si nécessaire
DATABASE_URL: URL de la base de données
JWT_SECRET: Clé secrète pour JWT
```

### Branches
- `main` : Branche de production
- `develop` : Branche de développement (optionnel)

## Monitoring

Le pipeline génère des logs détaillés pour :
- Tests unitaires
- Builds
- Déploiements
- Health checks

## Résolution des problèmes

### Tests qui échouent
1. Vérifier les logs GitHub Actions
2. Exécuter les tests localement
3. Corriger les erreurs
4. Pousser les corrections

### Build qui échoue
1. Vérifier les dépendances
2. Tester le build localement
3. Vérifier la configuration Docker

## Améliorations futures

- [ ] Ajout de tests d'intégration
- [ ] Déploiement automatique en production
- [ ] Monitoring des performances
- [ ] Notifications Slack/Email
- [ ] Tests de sécurité automatisés
