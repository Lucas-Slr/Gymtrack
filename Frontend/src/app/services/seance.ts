import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seance } from '../models/seance.model';
import { AuthService } from './auth.service';

export interface Statistiques {
  totalSeances: number;
  totalExercices: number;
  dureeTotale: string;
}

export interface StatistiqueMensuelle {
  mois: number;
  nombreSeances: number;
}

@Injectable({
  providedIn: 'root'
})
export class SeanceService {
  private apiUrl = 'http://localhost:5000/seance';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Récupérer toutes les séances
  getSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Créer une nouvelle séance
  createSeance(seance: Partial<Seance>): Observable<Seance> {
    return this.http.post<Seance>(this.apiUrl, seance, { headers: this.getHeaders() });
  }

  // Récupérer une séance par ID
  getSeance(id: string): Observable<Seance> {
    return this.http.get<Seance>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Mettre à jour une séance
  updateSeance(id: string, seance: Partial<Seance>): Observable<Seance> {
    return this.http.put<Seance>(`${this.apiUrl}/${id}`, seance, { headers: this.getHeaders() });
  }

  // Supprimer une séance
  deleteSeance(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Récupérer les statistiques générales
  getStatistiques(): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  // Récupérer les statistiques mensuelles
  getStatistiquesMensuelles(): Observable<StatistiqueMensuelle[]> {
    return this.http.get<StatistiqueMensuelle[]>(`${this.apiUrl}/stats/mensuel`, { headers: this.getHeaders() });
  }

  // Récupérer les séances récentes
  getSeancesRecentes(): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.apiUrl}/recentes`, { headers: this.getHeaders() });
  }

  // Méthodes pour compatibilité avec les pages existantes
  addSeance(seance: Seance): Observable<Seance> {
    return this.createSeance(seance);
  }

  getSeanceEnCours(): Observable<Seance | null> {
    return this.http.get<Seance | null>(`${this.apiUrl}/encours`, { headers: this.getHeaders() });
  }

  terminerSeance(id: string): Observable<Seance> {
    return this.http.patch<Seance>(`${this.apiUrl}/${id}/terminer`, { enCours: false }, { headers: this.getHeaders() });
  }

  // Récupérer les séances enregistrées
  getSeancesEnregistrees(): Observable<Seance[]> {
    console.log('🔍 Service: Envoi requête GET /enregistrees');
    console.log('🔍 Headers:', this.getHeaders());
    return this.http.get<Seance[]>(`${this.apiUrl}/enregistrees`, { headers: this.getHeaders() });
  }

  // Lancer une séance enregistrée
  lancerSeanceEnregistree(id: string): Observable<Seance> {
    return this.http.patch<Seance>(`${this.apiUrl}/${id}/lancer`, {}, { headers: this.getHeaders() });
  }

  // Désenregistrer une séance
  desenregistrerSeance(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${id}/desenregistrer`, {}, { headers: this.getHeaders() });
  }
}
