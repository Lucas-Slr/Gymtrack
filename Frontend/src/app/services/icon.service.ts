import { Injectable } from '@angular/core';

export interface IconConfig {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IconService {

  // Mapping des icônes Heroicons vers les noms utilisés dans l'app
  private iconMap: { [key: string]: string } = {
    // Navigation
    'dashboard': 'HomeIcon',
    'profile': 'UserIcon',
    'user': 'UserIcon',
    'settings': 'Cog6ToothIcon',
    'logout': 'ArrowRightOnRectangleIcon',
    'log-out': 'ArrowRightOnRectangleIcon',
    'login': 'ArrowLeftOnRectangleIcon',
    'register': 'UserPlusIcon',
    
    // Fitness & Gym
    'fitness': 'FireIcon',
    'dumbbell': 'DumbbellIcon',
    'workout': 'BoltIcon',
    'timer': 'ClockIcon',
    'calendar': 'CalendarIcon',
    'chart': 'ChartBarIcon',
    'stats': 'ChartPieIcon',
    'muscle': 'MuscleIcon',
    'heart': 'HeartIcon',
    
    // Actions
    'add': 'PlusIcon',
    'add-circle': 'PlusCircleIcon',
    'edit': 'PencilIcon',
    'delete': 'TrashIcon',
    'save': 'CheckIcon',
    'cancel': 'XMarkIcon',
    'search': 'MagnifyingGlassIcon',
    'filter': 'FunnelIcon',
    'sort': 'ArrowsUpDownIcon',
    'refresh': 'ArrowPathIcon',
    
    // UI Elements
    'menu': 'Bars3Icon',
    'close': 'XMarkIcon',
    'chevron-down': 'ChevronDownIcon',
    'chevron-up': 'ChevronUpIcon',
    'chevron-left': 'ChevronLeftIcon',
    'chevron-right': 'ChevronRightIcon',
    'arrow-up': 'ArrowUpIcon',
    'arrow-down': 'ArrowDownIcon',
    'ellipsis': 'EllipsisHorizontalIcon',
    
    // Social
    'facebook': 'FacebookIcon',
    'twitter': 'TwitterIcon',
    'instagram': 'InstagramIcon',
    'youtube': 'YoutubeIcon',
    'linkedin': 'LinkedInIcon',
    
    // Status
    'success': 'CheckCircleIcon',
    'error': 'XCircleIcon',
    'warning': 'ExclamationTriangleIcon',
    'info': 'InformationCircleIcon',
    
    // Exercise types
    'cardio': 'HeartIcon',
    'strength': 'MuscleIcon',
    'flexibility': 'ArrowPathIcon',
    'balance': 'ScaleIcon',
    
    // Additional
    'star': 'StarIcon',
    'bookmark': 'BookmarkIcon',
    'share': 'ShareIcon',
    'download': 'ArrowDownTrayIcon',
    'upload': 'ArrowUpTrayIcon',
    'eye': 'EyeIcon',
    'eye-slash': 'EyeSlashIcon',
    'lock': 'LockClosedIcon',
    'unlock': 'LockOpenIcon'
  };

  // Tailles d'icônes
  private sizeClasses = {
    'xs': 'w-3 h-3',
    'sm': 'w-4 h-4',
    'md': 'w-5 h-5',
    'lg': 'w-6 h-6',
    'xl': 'w-8 h-8'
  };

  constructor() { }

  /**
   * Obtient le nom de l'icône Heroicon correspondant
   */
  getIconName(alias: string): string {
    return this.iconMap[alias] || 'QuestionMarkCircleIcon';
  }

  /**
   * Obtient la classe de taille pour l'icône
   */
  getSizeClass(size: string = 'md'): string {
    return this.sizeClasses[size as keyof typeof this.sizeClasses] || this.sizeClasses.md;
  }

  /**
   * Génère les classes CSS complètes pour une icône
   */
  getIconClasses(config: IconConfig): string {
    const sizeClass = this.getSizeClass(config.size);
    const customClass = config.className || '';
    return `${sizeClass} ${customClass}`.trim();
  }

  /**
   * Obtient toutes les icônes disponibles
   */
  getAvailableIcons(): string[] {
    return Object.keys(this.iconMap);
  }

  /**
   * Ajoute une nouvelle icône au mapping
   */
  addIcon(alias: string, iconName: string): void {
    this.iconMap[alias] = iconName;
  }
} 