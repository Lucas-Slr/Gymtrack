import { describe, it, expect } from 'vitest';

describe('Formatters Utils', () => {
  it('should format weight correctly', () => {
    const formatWeight = (weight: number) => {
      return `${weight} kg`;
    };
    
    expect(formatWeight(70)).toBe('70 kg');
    expect(formatWeight(85.5)).toBe('85.5 kg');
    expect(formatWeight(0)).toBe('0 kg');
  });

  it('should format height correctly', () => {
    const formatHeight = (height: number) => {
      const meters = Math.floor(height / 100);
      const centimeters = height % 100;
      return `${meters}m${centimeters.toString().padStart(2, '0')}`;
    };
    
    expect(formatHeight(175)).toBe('1m75');
    expect(formatHeight(180)).toBe('1m80');
    expect(formatHeight(165)).toBe('1m65');
  });

  it('should format duration in minutes', () => {
    const formatDuration = (minutes: number) => {
      if (minutes < 60) {
        return `${minutes} min`;
      }
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
    };
    
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(90)).toBe('1h30');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(75)).toBe('1h15');
  });

  it('should format date in French', () => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const testDate = new Date('2024-01-15');
    const formatted = formatDate(testDate);
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
  });

  it('should format time in HH:MM:SS', () => {
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      return [hours, minutes, secs]
        .map(val => val.toString().padStart(2, '0'))
        .join(':');
    };
    
    expect(formatTime(3661)).toBe('01:01:01');
    expect(formatTime(125)).toBe('00:02:05');
    expect(formatTime(0)).toBe('00:00:00');
  });

  it('should format percentage', () => {
    const formatPercentage = (value: number, total: number) => {
      if (total === 0) return '0%';
      const percentage = (value / total) * 100;
      return `${percentage.toFixed(1)}%`;
    };
    
    expect(formatPercentage(75, 100)).toBe('75.0%');
    expect(formatPercentage(3, 10)).toBe('30.0%');
    expect(formatPercentage(0, 50)).toBe('0.0%');
    expect(formatPercentage(50, 0)).toBe('0%');
  });

  it('should format file size', () => {
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('should format currency', () => {
    const formatCurrency = (amount: number, currency: string = 'EUR') => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount);
    };
    
    expect(formatCurrency(1234.56)).toContain('234,56');
    expect(formatCurrency(0)).toContain('0,00');
    expect(formatCurrency(99.99)).toContain('99,99');
  });
});
