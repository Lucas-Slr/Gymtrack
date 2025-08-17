import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <i 
      [class]="iconClasses"
      [attr.aria-hidden]="true"
      [attr.role]="'img'"
      [attr.aria-label]="ariaLabel"
    ></i>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class IconComponent {
  @Input() name!: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() className: string = '';
  @Input() ariaLabel: string = '';

  get iconClasses(): string {
    const sizeClass = this.getSizeClass();
    const iconClass = this.getIconClass();
    const customClass = this.className || '';
    return `${iconClass} ${sizeClass} ${customClass}`.trim();
  }

  private getSizeClass(): string {
    const sizeMap = {
      'xs': 'fa-xs',
      'sm': 'fa-sm', 
      'md': 'fa-md',
      'lg': 'fa-lg',
      'xl': 'fa-xl'
    };
    return sizeMap[this.size] || 'fa-md';
  }

  private getIconClass(): string {
    const iconMap: { [key: string]: string } = {
      // Navigation
      'dashboard': 'fas fa-home',
      'profile': 'fas fa-user',
      'user': 'fas fa-user',
      'settings': 'fas fa-cog',
      'logout': 'fas fa-sign-out-alt',
      'log-out': 'fas fa-sign-out-alt',
      'login': 'fas fa-sign-in-alt',
      'register': 'fas fa-user-plus',
      
      // Fitness & Gym
      'fitness': 'fas fa-fire',
      'dumbbell': 'fas fa-dumbbell',
      'workout': 'fas fa-bolt',
      'timer': 'fas fa-clock',
      'calendar': 'fas fa-calendar',
      'chart': 'fas fa-chart-bar',
      'stats': 'fas fa-chart-pie',
      'muscle': 'fas fa-running',
      'heart': 'fas fa-heart',
      
      // Actions
      'add': 'fas fa-plus',
      'add-circle': 'fas fa-plus-circle',
      'edit': 'fas fa-edit',
      'delete': 'fas fa-trash',
      'save': 'fas fa-check',
      'cancel': 'fas fa-times',
      'search': 'fas fa-search',
      'filter': 'fas fa-filter',
      'sort': 'fas fa-sort',
      'refresh': 'fas fa-sync',
      
      // UI Elements
      'menu': 'fas fa-bars',
      'close': 'fas fa-times',
      'chevron-down': 'fas fa-chevron-down',
      'chevron-up': 'fas fa-chevron-up',
      'chevron-left': 'fas fa-chevron-left',
      'chevron-right': 'fas fa-chevron-right',
      'arrow-up': 'fas fa-arrow-up',
      'arrow-down': 'fas fa-arrow-down',
      'ellipsis': 'fas fa-ellipsis-h',
      
      // Social
      'facebook': 'fab fa-facebook',
      'twitter': 'fab fa-twitter',
      'instagram': 'fab fa-instagram',
      'youtube': 'fab fa-youtube',
      'linkedin': 'fab fa-linkedin',
      
      // Status
      'success': 'fas fa-check-circle',
      'error': 'fas fa-times-circle',
      'warning': 'fas fa-exclamation-triangle',
      'info': 'fas fa-info-circle',
      
      // Exercise types
      'cardio': 'fas fa-heartbeat',
      'strength': 'fas fa-dumbbell',
      'flexibility': 'fas fa-child',
      'balance': 'fas fa-balance-scale',
      
      // Additional
      'star': 'fas fa-star',
      'bookmark': 'fas fa-bookmark',
      'share': 'fas fa-share',
      'download': 'fas fa-download',
      'upload': 'fas fa-upload',
      'eye': 'fas fa-eye',
      'eye-slash': 'fas fa-eye-slash',
      'lock': 'fas fa-lock',
      'unlock': 'fas fa-unlock',
      'stop': 'fas fa-stop',
      'check': 'fas fa-check',
      'minus': 'fas fa-minus',
      'plus': 'fas fa-plus'
    };
    
    return iconMap[this.name] || 'fas fa-question-circle';
  }
} 