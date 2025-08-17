// Script d'initialisation MongoDB pour GymTrack
db = db.getSiblingDB('gymtrack');

// Créer un utilisateur de test pour les jurys
db.createUser({
  user: "testuser",
  pwd: "testpass123",
  roles: [
    {
      role: "readWrite",
      db: "gymtrack"
    }
  ]
});

// Créer les collections nécessaires
db.createCollection('users');
db.createCollection('seances');

// Insérer un utilisateur de test
db.users.insertOne({
  email: "test@example.com",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
  nom: "Utilisateur",
  prenom: "Test",
  dateNaissance: new Date("1990-01-01"),
  age: 33,
  poids: 70,
  taille: 175,
  objectif: "Musculation",
  niveau: "Débutant",
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Base de données GymTrack initialisée avec succès !");
print("Utilisateur de test créé : test@example.com / password");
