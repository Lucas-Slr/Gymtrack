import { describe, it, expect } from 'vitest';

describe('Date Utils', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const formatted = formatDate(date);
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
  });

  it('should calculate days between dates', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-15');
    
    const daysBetween = (start: Date, end: Date) => {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };
    
    const days = daysBetween(startDate, endDate);
    expect(days).toBe(14);
  });

  it('should check if date is today', () => {
    const today = new Date();
    
    const isToday = (date: Date) => {
      const todayStr = today.toDateString();
      const dateStr = date.toDateString();
      return todayStr === dateStr;
    };
    
    expect(isToday(today)).toBe(true);
  });

  it('should get week number', () => {
    const date = new Date('2024-01-15');
    
    const getWeekNumber = (date: Date) => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };
    
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBeGreaterThan(0);
    expect(weekNumber).toBeLessThanOrEqual(53);
  });
});
