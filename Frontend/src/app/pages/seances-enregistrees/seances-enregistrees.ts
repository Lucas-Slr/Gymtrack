import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeanceService } from '../../services/seance';
import { SeanceEditService } from '../../services/seance-edit.service';
import { Seance } from '../../models/seance.model';
import { IconComponent } from '../../components/icon/icon.component';
import { SeancesEnregistreesTableComponent } from '../../components/seances-enregistrees-table/seances-enregistrees-table.component';

@Component({
  selector: 'app-seances-enregistrees',
  templateUrl: './seances-enregistrees.html',
  styleUrl: './seances-enregistrees.scss',
  standalone: true,
  imports: [CommonModule, IconComponent, SeancesEnregistreesTableComponent]
})
export class SeancesEnregistrees implements OnInit {
  seancesEnregistrees: Seance[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private seanceService: SeanceService,
    private seanceEditService: SeanceEditService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerSeancesEnregistrees();
  }

  chargerSeancesEnregistrees() {
    console.log('🔄 Début du chargement des séances enregistrées');
    this.isLoading = true;
    this.errorMessage = '';

    this.seanceService.getSeancesEnregistrees().subscribe({
      next: (seances) => {
        console.log('✅ Réponse reçue du backend:', seances);
        console.log('📊 Type de données:', typeof seances);
        console.log('📊 Longueur du tableau:', Array.isArray(seances) ? seances.length : 'Pas un tableau');
        
        this.seancesEnregistrees = seances;
        this.isLoading = false;
        console.log('✅ Séances enregistrées chargées:', seances);
        console.log('✅ isLoading mis à false');
        
        // Forcer la détection de changements
        this.cdr.detectChanges();
        console.log('✅ Détection de changements forcée');
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des séances enregistrées:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Message:', error.message);
        this.errorMessage = 'Erreur lors du chargement des séances enregistrées';
        this.isLoading = false;
        console.log('✅ isLoading mis à false (erreur)');
        
        // Forcer la détection de changements
        this.cdr.detectChanges();
        console.log('✅ Détection de changements forcée (erreur)');
      }
    });
  }

  // Méthodes pour gérer les événements du tableau
  onSeanceLancee(seance: Seance) {
    console.log('Lancement de la séance:', seance.nom);
    
    this.seanceService.lancerSeanceEnregistree(seance._id!).subscribe({
      next: (nouvelleSeance) => {
        console.log('Séance lancée avec succès:', nouvelleSeance);
        // Redirection vers la page séance en cours
        this.router.navigate(['/seance-en-cours']);
      },
      error: (error) => {
        console.error('Erreur lors du lancement de la séance:', error);
        if (error.status === 400) {
          this.errorMessage = 'Une séance est déjà en cours. Terminez-la d\'abord.';
        } else {
          this.errorMessage = 'Erreur lors du lancement de la séance';
        }
      }
    });
  }

  onSeanceModifiee(seance: Seance) {
    console.log('Modification de la séance:', seance.nom);
    // Stocker la séance à modifier dans le service
    this.seanceEditService.setSeanceAModifier(seance);
    // Redirection vers la page de création
    this.router.navigate(['/creation-seance']);
  }

  onSeanceSupprimee(seanceId: string) {
    console.log('Suppression de la séance avec ID:', seanceId);
    
    this.seanceService.desenregistrerSeance(seanceId).subscribe({
      next: (response) => {
        console.log('Séance supprimée avec succès:', response);
        // Recharger la liste
        this.chargerSeancesEnregistrees();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.errorMessage = 'Erreur lors de la suppression de la séance';
      }
    });
  }

  calculerDureeTotale(exercices: any[]): number {
    if (exercices.length === 0) return 0;
    
    let dureeTotale = 0;
    exercices.forEach(exercice => {
      const nombreSeries = exercice.nombreSeries || exercice.series || 3;
      const duree = exercice.duree || 60;
      const tempsRepos = exercice.tempsRepos || 90;
      
      dureeTotale += duree * nombreSeries;
      dureeTotale += tempsRepos * (nombreSeries - 1);
    });
    
    return Math.round(dureeTotale / 60); // Convertir en minutes
  }

  formaterDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Méthodes de navigation
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToCreation() {
    this.router.navigate(['/creation-seance']);
  }

  // Méthode pour obtenir les noms des exercices
  getNomsExercices(exercices: any[]): string {
    return exercices.map(e => e.nom).join(', ');
  }
}
