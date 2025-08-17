import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  age: number;
  poids: number;
  taille: number;
  username?: string;
  aboutMe?: string;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  age: number;
  poids: number;
  taille: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  nom?: string;
  prenom?: string;
  email?: string;
  age?: number;
  poids?: number;
  taille?: number;
  username?: string;
  aboutMe?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromStorage();
  }

  // Charger l'utilisateur depuis le localStorage
  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('currentUser');
      const token = localStorage.getItem('accessToken');
      
      if (user && token) {
        this.currentUserSubject.next(JSON.parse(user));
        this.setupTokenRefresh();
      }
    }
  }

  // Inscription
  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        if (response.success) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Connexion
  login(loginData: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginData).pipe(
      tap(response => {
        if (response.success) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Déconnexion
  logout(): Observable<any> {
    let refreshToken = null;
    if (isPlatformBrowser(this.platformId)) {
      refreshToken = localStorage.getItem('refreshToken');
    }
    const headers = this.getAuthHeaders();
    
    return this.http.post(`${this.API_URL}/logout`, { refreshToken }, { headers }).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        // Même en cas d'erreur, on déconnecte localement
        this.clearAuthData();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  // Rafraîchir le token
  refreshToken(): Observable<any> {
    let refreshToken = null;
    if (isPlatformBrowser(this.platformId)) {
      refreshToken = localStorage.getItem('refreshToken');
    }
    
    if (!refreshToken) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Aucun token de rafraîchissement'));
    }

    return this.http.post(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response.success) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
        }
      }),
      catchError(error => {
        this.clearAuthData();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      return !!token && !!this.currentUserSubject.value;
    }
    return false;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Obtenir les headers d'authentification
  getAuthHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Vérifier la validité du token
  verifyToken(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/verify`, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Token expiré, essayer de le rafraîchir
          return this.refreshToken();
        }
        return throwError(() => error);
      })
    );
  }

  // Obtenir le profil utilisateur
  getProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/profile`, { headers }).pipe(
      tap((response: any) => {
        if (response.success) {
          this.currentUserSubject.next(response.data.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  // Méthode pour mettre à jour le profil utilisateur
  updateProfile(profileData: ProfileUpdateData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.API_URL}/profile`, profileData, { headers }).pipe(
      tap((response: any) => {
        if (response.success) {
          this.currentUserSubject.next(response.data.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  // Gérer le succès de l'authentification
  private handleAuthSuccess(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    this.currentUserSubject.next(data.user);
    this.setupTokenRefresh();
  }

  // Nettoyer les données d'authentification
  private clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  // Configurer le rafraîchissement automatique du token
  private setupTokenRefresh(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Rafraîchir le token toutes les 14 minutes (avant l'expiration à 15 minutes)
      setInterval(() => {
        if (this.isAuthenticated()) {
          this.refreshToken().subscribe();
        }
      }, 14 * 60 * 1000);
    }
  }

  // Gérer les erreurs
  private handleError(error: any): Observable<never> {
    console.error('Erreur d\'authentification:', error);
    return throwError(() => error);
  }
} 