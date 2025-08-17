import { describe, it, expect } from 'vitest';

describe('Statistics Utils', () => {
  it('should calculate average weight', () => {
    const calculateAverage = (values: number[]) => {
      if (values.length === 0) return 0;
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    };
    
    expect(calculateAverage([70, 72, 71, 73, 69])).toBe(71);
    expect(calculateAverage([100, 80, 90])).toBe(90);
    expect(calculateAverage([])).toBe(0);
  });

  it('should calculate median weight', () => {
    const calculateMedian = (values: number[]) => {
      if (values.length === 0) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 
        ? (sorted[mid - 1] + sorted[mid]) / 2 
        : sorted[mid];
    };
    
    expect(calculateMedian([70, 72, 71, 73, 69])).toBe(71);
    expect(calculateMedian([100, 80, 90, 85])).toBe(87.5);
    expect(calculateMedian([50])).toBe(50);
  });

  it('should calculate standard deviation', () => {
    const calculateStdDev = (values: number[]) => {
      if (values.length === 0) return 0;
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
      const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
      return Math.sqrt(avgSquaredDiff);
    };
    
    expect(calculateStdDev([70, 72, 71, 73, 69])).toBeCloseTo(1.41, 1);
    expect(calculateStdDev([100, 100, 100])).toBe(0);
  });

  it('should calculate weekly progress', () => {
    const calculateWeeklyProgress = (seances: any[]) => {
      const weeklyData = seances.reduce((acc, seance) => {
        const week = getWeekNumber(seance.date);
        if (!acc[week]) acc[week] = [];
        acc[week].push(seance);
        return acc;
      }, {});
      
      return Object.keys(weeklyData).map(week => ({
        week: parseInt(week),
        count: weeklyData[week].length,
        totalVolume: weeklyData[week].reduce((sum, s) => sum + s.volume, 0)
      }));
    };
    
    const getWeekNumber = (date: Date) => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };
    
    const seances = [
      { date: new Date('2024-01-01'), volume: 1000 },
      { date: new Date('2024-01-02'), volume: 1200 },
      { date: new Date('2024-01-08'), volume: 1100 }
    ];
    
    const progress = calculateWeeklyProgress(seances);
    expect(progress.length).toBeGreaterThan(0);
  });

  it('should calculate streak days', () => {
    const calculateStreak = (dates: Date[]) => {
      if (dates.length === 0) return 0;
      
      const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
      let streak = 1;
      let currentDate = new Date(sortedDates[0]);
      
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        
        if (sortedDates[i].toDateString() === prevDate.toDateString()) {
          streak++;
          currentDate = new Date(sortedDates[i]);
        } else {
          break;
        }
      }
      
      return streak;
    };
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    expect(calculateStreak([today, yesterday, twoDaysAgo])).toBe(3);
    expect(calculateStreak([today, twoDaysAgo])).toBe(1);
    expect(calculateStreak([])).toBe(0);
  });

  it('should calculate personal records', () => {
    const calculatePRs = (exercices: any[]) => {
      const prs = {};
      
      exercices.forEach(exo => {
        if (!prs[exo.nom] || exo.poids > prs[exo.nom]) {
          prs[exo.nom] = exo.poids;
        }
      });
      
      return prs;
    };
    
    const exercices = [
      { nom: 'Développé couché', poids: 100 },
      { nom: 'Squat', poids: 120 },
      { nom: 'Développé couché', poids: 105 },
      { nom: 'Squat', poids: 125 }
    ];
    
    const prs = calculatePRs(exercices);
    expect(prs['Développé couché']).toBe(105);
    expect(prs['Squat']).toBe(125);
  });
});
