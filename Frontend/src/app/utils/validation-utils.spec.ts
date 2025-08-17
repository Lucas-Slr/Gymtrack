import { describe, it, expect } from 'vitest';

describe('Validation Utils', () => {
  it('should validate email format', () => {
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });

  it('should validate password strength', () => {
    const validatePassword = (password: string) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      
      return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    };
    
    expect(validatePassword('StrongPass123')).toBe(true);
    expect(validatePassword('weak')).toBe(false);
    expect(validatePassword('nouppercase123')).toBe(false);
    expect(validatePassword('NOLOWERCASE123')).toBe(false);
    expect(validatePassword('NoNumbers')).toBe(false);
  });

  it('should validate age range', () => {
    const validateAge = (age: number) => {
      return age >= 13 && age <= 120;
    };
    
    expect(validateAge(25)).toBe(true);
    expect(validateAge(13)).toBe(true);
    expect(validateAge(120)).toBe(true);
    expect(validateAge(12)).toBe(false);
    expect(validateAge(121)).toBe(false);
    expect(validateAge(-1)).toBe(false);
  });

  it('should validate weight range', () => {
    const validateWeight = (weight: number) => {
      return weight >= 30 && weight <= 300;
    };
    
    expect(validateWeight(70)).toBe(true);
    expect(validateWeight(30)).toBe(true);
    expect(validateWeight(300)).toBe(true);
    expect(validateWeight(29)).toBe(false);
    expect(validateWeight(301)).toBe(false);
  });

  it('should validate height range', () => {
    const validateHeight = (height: number) => {
      return height >= 100 && height <= 250;
    };
    
    expect(validateHeight(175)).toBe(true);
    expect(validateHeight(100)).toBe(true);
    expect(validateHeight(250)).toBe(true);
    expect(validateHeight(99)).toBe(false);
    expect(validateHeight(251)).toBe(false);
  });

  it('should validate required fields', () => {
    const validateRequired = (obj: any, requiredFields: string[]) => {
      return requiredFields.every(field => obj[field] !== undefined && obj[field] !== null && obj[field] !== '');
    };
    
    const user = {
      nom: 'Doe',
      prenom: 'John',
      email: 'john@example.com',
      age: 25
    };
    
    expect(validateRequired(user, ['nom', 'prenom', 'email'])).toBe(true);
    expect(validateRequired(user, ['nom', 'prenom', 'email', 'age'])).toBe(true);
    expect(validateRequired(user, ['nom', 'prenom', 'email', 'age', 'missing'])).toBe(false);
  });
});
