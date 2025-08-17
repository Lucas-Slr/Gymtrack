const mongoose = require('mongoose');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  beforeAll(async () => {
    await startMongoMemoryServer();
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
    await stopMongoMemoryServer();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Validation', () => {
             it('should create a valid user', async () => {
           const userData = {
             nom: 'Doe',
             prenom: 'John',
             email: 'john.doe@example.com',
             password: 'password123',
             age: 25,
             taille: 175,
             poids: 70
           };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.nom).toBe(userData.nom);
      expect(savedUser.prenom).toBe(userData.prenom);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.age).toBe(userData.age);
      expect(savedUser._id).toBeDefined();
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

         it('should require nom field', async () => {
       const userData = {
         prenom: 'John',
         email: 'john.doe@example.com',
         password: 'password123',
         age: 25,
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.nom).toBeDefined();
    });

         it('should require prenom field', async () => {
       const userData = {
         nom: 'Doe',
         email: 'john.doe@example.com',
         password: 'password123',
         age: 25,
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.prenom).toBeDefined();
    });

         it('should require email field', async () => {
       const userData = {
         nom: 'Doe',
         prenom: 'John',
         password: 'password123',
         age: 25,
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

         it('should require password field', async () => {
       const userData = {
         nom: 'Doe',
         prenom: 'John',
         email: 'john.doe@example.com',
         age: 25,
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

         it('should require age field', async () => {
       const userData = {
         nom: 'Doe',
         prenom: 'John',
         email: 'john.doe@example.com',
         password: 'password123',
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.age).toBeDefined();
    });

         it('should validate email format', async () => {
       const userData = {
         nom: 'Doe',
         prenom: 'John',
         email: 'invalid-email',
         password: 'password123',
         age: 25,
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

         it('should validate age range', async () => {
       const userData = {
         nom: 'Doe',
         prenom: 'John',
         email: 'john.doe@example.com',
         password: 'password123',
         age: 1, // Trop jeune
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.age).toBeDefined();
    });

             it('should enforce unique email', async () => {
      const userData1 = {
        nom: 'Doe',
        prenom: 'John',
        email: 'john.doe@example.com',
        password: 'password123',
        age: 25,
        taille: 175,
        poids: 70
      };

      const userData2 = {
        nom: 'Smith',
        prenom: 'Jane',
        email: 'john.doe@example.com', // Même email
        password: 'password456',
        age: 30,
        taille: 165,
        poids: 60
      };

      // Créer le premier utilisateur
      await new User(userData1).save();

      // Essayer de créer un deuxième avec le même email
      const duplicateUser = new User(userData2);
      let error;

      try {
        await duplicateUser.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });
  });

  describe('Password Hashing', () => {
         it('should hash password before saving', async () => {
       const userData = {
         nom: 'Doe',
         prenom: 'John',
         email: 'john.doe@example.com',
         password: 'password123',
         age: 25,
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt format
    });

         it('should verify password correctly', async () => {
       const userData = {
         nom: 'Doe',
         prenom: 'John',
         email: 'john.doe@example.com',
         password: 'password123',
         age: 25,
         taille: 175,
         poids: 70
       };

      const user = new User(userData);
      await user.save();

      const isValid = await bcrypt.compare('password123', user.password);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('wrongpassword', user.password);
      expect(isInvalid).toBe(false);
    });
  });

           describe('Instance Methods', () => {
           it('should return full name', () => {
             const user = new User({
               nom: 'Doe',
               prenom: 'John',
               email: 'john.doe@example.com',
               password: 'password123',
               age: 25,
               taille: 175,
               poids: 70
             });

      expect(user.getFullName()).toBe('John Doe');
    });
  });
});
