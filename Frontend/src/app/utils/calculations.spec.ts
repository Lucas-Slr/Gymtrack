import { describe, it, expect } from 'vitest';

describe('Fitness Calculations', () => {
  it('should calculate BMI correctly', () => {
    const calculateBMI = (weight: number, height: number) => {
      const heightInMeters = height / 100;
      return weight / (heightInMeters * heightInMeters);
    };
    
    expect(calculateBMI(70, 175)).toBeCloseTo(22.86, 2);
    expect(calculateBMI(80, 180)).toBeCloseTo(24.69, 2);
    expect(calculateBMI(60, 170)).toBeCloseTo(20.76, 2);
  });

  it('should calculate BMI category', () => {
    const getBMICategory = (bmi: number) => {
      if (bmi < 18.5) return 'Insuffisance pondérale';
      if (bmi < 25) return 'Poids normal';
      if (bmi < 30) return 'Surpoids';
      return 'Obésité';
    };
    
    expect(getBMICategory(17)).toBe('Insuffisance pondérale');
    expect(getBMICategory(22)).toBe('Poids normal');
    expect(getBMICategory(27)).toBe('Surpoids');
    expect(getBMICategory(32)).toBe('Obésité');
  });

  it('should calculate one rep max (1RM)', () => {
    const calculate1RM = (weight: number, reps: number) => {
      // Formule d'Epley
      return weight * (1 + reps / 30);
    };
    
    expect(calculate1RM(100, 5)).toBeCloseTo(116.67, 2);
    expect(calculate1RM(80, 10)).toBeCloseTo(106.67, 2);
    expect(calculate1RM(120, 3)).toBeCloseTo(132, 2);
  });

  it('should calculate volume total', () => {
    const calculateVolume = (exercices: any[]) => {
      return exercices.reduce((total, exo) => {
        return total + (exo.series * exo.repetitions * exo.poids);
      }, 0);
    };
    
    const exercices = [
      { series: 3, repetitions: 10, poids: 80 },
      { series: 4, repetitions: 12, poids: 60 }
    ];
    
    const volume = calculateVolume(exercices);
    expect(volume).toBe(3 * 10 * 80 + 4 * 12 * 60); // 2400 + 2880 = 5280
  });

  it('should calculate progression percentage', () => {
    const calculateProgression = (oldWeight: number, newWeight: number) => {
      return ((newWeight - oldWeight) / oldWeight) * 100;
    };
    
    expect(calculateProgression(100, 110)).toBe(10);
    expect(calculateProgression(80, 76)).toBe(-5);
    expect(calculateProgression(50, 50)).toBe(0);
  });

  it('should calculate rest time between sets', () => {
    const calculateRestTime = (intensity: number, reps: number) => {
      if (intensity > 90) return 3; // 3 minutes pour intensité très élevée
      if (intensity > 80) return 2; // 2 minutes pour intensité élevée
      if (intensity > 70) return 1.5; // 1.5 minutes pour intensité modérée
      return 1; // 1 minute pour intensité faible
    };
    
    expect(calculateRestTime(95, 3)).toBe(3);
    expect(calculateRestTime(85, 5)).toBe(2);
    expect(calculateRestTime(75, 8)).toBe(1.5);
    expect(calculateRestTime(65, 12)).toBe(1);
  });
});
