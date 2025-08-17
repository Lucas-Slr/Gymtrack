import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ApplicationRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { IconComponent } from '../../components/icon/icon.component';
import { CommonModule } from '@angular/common';
import { SeanceService } from '../../services/seance';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';

interface ExerciceEnCours {
  id: string;
  nom: string;
  nombreSeries: number;
  seriesEffectuees: number;
  tempsRepos: number; // en secondes
  duree: number; // en secondes
  termine: boolean;
  chrono: number; // temps restant de récup en secondes
  chronoActif: boolean;
}

interface SeanceEnCoursModel {
  id: string;
  nom: string;
  exercices: ExerciceEnCours[];
  dureeEstimee: number; // en minutes
}

@Component({
  selector: 'app-seance-en-cours',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './seance-en-cours.html',
  styleUrl: './seance-en-cours.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class SeanceEnCours implements OnInit, OnDestroy {
  seance: SeanceEnCoursModel | null = null;
  isLoading = new BehaviorSubject<boolean>(true);
  errorMessage = '';
  private chronoIntervals: Map<string, NodeJS.Timeout> = new Map();
  private destroy$ = new Subject<void>();

  constructor(
    private seanceService: SeanceService,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public router: Router
  ) {}

  ngOnInit() {
    // Petit délai pour s'assurer que la page est bien chargée
    setTimeout(() => {
      this.chargerSeanceEnCours();
    }, 100);
  }

  ngOnDestroy() {
    // Nettoyer tous les intervalles de chrono lors de la destruction du composant
    this.arreterTousLesChronos();
    this.destroy$.next();
    this.destroy$.complete();
  }

  chargerSeanceEnCours() {
    this.isLoading.next(true);
    this.errorMessage = '';
    
    // Arrêter tous les chronos existants avant de charger une nouvelle séance
    this.arreterTousLesChronos();

    this.seanceService.getSeanceEnCours().subscribe({
      next: (seanceBackend: any) => {
        console.log('Réponse reçue:', seanceBackend);
        
        // Si seanceBackend est null ou undefined, c'est normal (pas de séance en cours)
        if (seanceBackend && seanceBackend._id) {
          console.log('Données de la séance reçues:', seanceBackend);
          
          // Convertir les données du backend vers le format frontend
          this.seance = {
            id: seanceBackend._id || seanceBackend.id,
            nom: seanceBackend.nom || seanceBackend.titre, // Support des deux formats
            exercices: seanceBackend.exercices.map((ex: any, index: number) => {
                             const exercice = {
                 id: `exo-${index}`,
                 nom: ex.nom,
                 nombreSeries: ex.nombreSeries || ex.series, // Support des deux formats
                 seriesEffectuees: 0,
                 tempsRepos: ex.tempsRepos || 90, // Utiliser la valeur du backend ou défaut
                 duree: ex.duree || 60, // Utiliser la valeur du backend ou défaut
                 termine: false,
                 chrono: 0,
                 chronoActif: false
               };
               console.log(`📋 Exercice ${index} créé:`, exercice.nom, 'Temps repos:', exercice.tempsRepos, 's');
              console.log(`Exercice ${index} créé:`, exercice);
              return exercice;
            }),
            dureeEstimee: this.calculerDureeEstimee(seanceBackend.exercices)
          };
          
          console.log('Séance convertie:', this.seance);
        } else {
          // Pas d'erreur, juste aucune séance en cours
          this.seance = null;
        }
        this.isLoading.next(false);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement de la séance en cours:', error);
        this.errorMessage = 'Erreur lors du chargement de la séance en cours.';
        this.isLoading.next(false);
      }
    });
  }

  calculerDureeEstimee(exercices: any[]): number {
    if (!exercices || exercices.length === 0) return 0;
    
    let dureeTotale = 0;
    exercices.forEach(exercice => {
      const nombreSeries = exercice.nombreSeries || exercice.series || 3;
      const duree = exercice.duree || 60;
      const tempsRepos = exercice.tempsRepos || 90;
      
      // Durée estimée par exercice
      dureeTotale += duree * nombreSeries;
      // Temps de repos entre les séries
      dureeTotale += tempsRepos * (nombreSeries - 1);
    });
    
    return Math.round(dureeTotale / 60);
  }

  // Pour la jauge de progression
  get totalExercices(): number {
    return this.seance?.exercices.length || 0;
  }
  
  get exercicesTermines(): number {
    return this.seance?.exercices.filter(e => e.termine).length || 0;
  }
  
  get progressionPourcentage(): number {
    if (!this.seance || this.totalExercices === 0) return 0;
    return Math.round((this.exercicesTermines / this.totalExercices) * 100);
  }
  
  get totalSeries(): number {
    return this.seance?.exercices.reduce((acc, e) => acc + e.nombreSeries, 0) || 0;
  }

    // Gestion des séries
  incrementerSerie(exo: ExerciceEnCours) {
    console.log('Tentative d\'incrémentation pour:', exo.nom, 'Séries actuelles:', exo.seriesEffectuees, '/', exo.nombreSeries);
    
    if (exo.seriesEffectuees < exo.nombreSeries && !exo.termine) {
      exo.seriesEffectuees++;
      console.log('Série incrémentée:', exo.seriesEffectuees, '/', exo.nombreSeries);
      
      if (exo.seriesEffectuees === exo.nombreSeries) {
        exo.termine = true;
        exo.chronoActif = false;
        exo.chrono = 0;
        // Arrêter le chrono si il était actif
        this.arreterChrono(exo.id);
        console.log('Exercice terminé:', exo.nom);
        // Forcer la détection de changements
        this.cdr.detectChanges();
      } else {
        console.log('🔄 Lancement du chrono après incrémentation de série');
        this.lancerChrono(exo);
      }
    } else {
      console.log('Impossible d\'incrémenter:', exo.seriesEffectuees, '/', exo.nombreSeries, 'Terminé:', exo.termine);
    }
  }
  
  decrementerSerie(exo: ExerciceEnCours) {
    if (exo.seriesEffectuees > 0 && !exo.termine) {
      exo.seriesEffectuees--;
      exo.chronoActif = false;
      exo.chrono = 0;
      // Arrêter le chrono si il était actif
      this.arreterChrono(exo.id);
      // Forcer la détection de changements
      this.cdr.detectChanges();
    }
  }

  // Arrêter un chrono spécifique
  private arreterChrono(exerciceId: string) {
    const interval = this.chronoIntervals.get(exerciceId);
    if (interval) {
      clearInterval(interval);
      this.chronoIntervals.delete(exerciceId);
    }
  }

  // Arrêter tous les chronos
  private arreterTousLesChronos() {
    this.chronoIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.chronoIntervals.clear();
  }

  // Chrono de récupération
  lancerChrono(exo: ExerciceEnCours) {
    console.log('🚀 Lancement du chrono pour:', exo.nom, 'Temps de repos:', exo.tempsRepos, 'secondes');
    
    // Arrêter le chrono précédent s'il existe
    this.arreterChrono(exo.id);
    
    // Initialiser le chrono dans la zone Angular
    this.ngZone.run(() => {
      exo.chrono = exo.tempsRepos;
      exo.chronoActif = true;
      // Forcer la détection de changements
      this.cdr.detectChanges();
    });
    
    console.log('⏰ Chrono initialisé:', exo.chrono, 'secondes, Actif:', exo.chronoActif);
    
    // Créer un intervalle en dehors de la zone Angular
    const interval = setInterval(() => {
      // Vérifier si le composant est toujours actif
      if (this.destroy$.closed) {
        clearInterval(interval);
        return;
      }
      
      // Mettre à jour le chrono dans la zone Angular
      this.ngZone.run(() => {
        if (exo.chrono > 0) {
          exo.chrono--;
          console.log('⏱️ Chrono:', exo.nom, 'Temps restant:', exo.chrono, 'secondes');
          // Forcer la détection de changements pour mettre à jour l'affichage
          this.cdr.detectChanges();
        } else {
          console.log('✅ Chrono terminé pour:', exo.nom);
          exo.chronoActif = false;
          this.chronoIntervals.delete(exo.id);
          clearInterval(interval);
          // Forcer la détection de changements pour réactiver les boutons
          this.cdr.detectChanges();
        }
      });
    }, 1000);
    
    // Stocker l'interval pour pouvoir l'arrêter plus tard
    this.chronoIntervals.set(exo.id, interval);
    console.log('📝 Interval stocké pour:', exo.id);
  }

  // Formatage du chrono
  formatChrono(secs: number): string {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Vérifier si tous les exercices sont terminés
  get tousExercicesTermines(): boolean {
    return this.seance?.exercices.every(ex => ex.termine) || false;
  }

  // Terminer la séance
  terminerSeance() {
    if (this.seance) {
      console.log('Tentative de terminaison de la séance:', this.seance.id);
      
      this.seanceService.terminerSeance(this.seance.id).subscribe({
        next: (response: any) => {
          console.log('Séance terminée avec succès:', response);
          // Rediriger vers le dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Erreur lors de la terminaison de la séance:', error);
          // Afficher un message d'erreur à l'utilisateur
          this.errorMessage = 'Erreur lors de la terminaison de la séance. Veuillez réessayer.';
        }
      });
    }
  }

  // Terminer la séance de force (même si pas tous les exercices sont terminés)
  terminerSeanceForcee() {
    if (this.seance) {
      console.log('Tentative de terminaison forcée de la séance:', this.seance.id);
      
      // Afficher une confirmation
      if (confirm('Êtes-vous sûr de vouloir terminer cette séance ? Tous les exercices non terminés seront marqués comme terminés.')) {
        this.seanceService.terminerSeance(this.seance.id).subscribe({
          next: (response: any) => {
            console.log('Séance terminée de force avec succès:', response);
            // Rediriger vers la page de création de séance
            this.router.navigate(['/creation-seance']);
          },
          error: (error: any) => {
            console.error('Erreur lors de la terminaison forcée de la séance:', error);
            // Afficher un message d'erreur à l'utilisateur
            this.errorMessage = 'Erreur lors de la terminaison de la séance. Veuillez réessayer.';
          }
        });
      }
    }
  }
}
