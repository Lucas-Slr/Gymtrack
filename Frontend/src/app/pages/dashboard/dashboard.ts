import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon/icon.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { SeancesTableComponent } from '../../components/seances-table/seances-table.component';
import { SeanceService, Statistiques, StatistiqueMensuelle } from '../../services/seance';
import { Seance } from '../../models/seance.model';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [CommonModule, IconComponent, ChartComponent, SeancesTableComponent]
})
export class Dashboard implements OnInit {
  // Statistiques
  statCards: StatCard[] = [
    { title: 'Séances', value: '0', icon: 'fitness', color: 'from-green-600 to-green-700' },
    { title: 'Durée totale', value: '0h 0m', icon: 'timer', color: 'from-green-600 to-green-700' },
    { title: 'Exercices', value: '0', icon: 'workout', color: 'from-green-600 to-green-700' },
  ];

  // Données pour le graphique
  graphData: number[] = [];
  graphLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  // Liste de séances récentes
  seances: Seance[] = [];

  // États de chargement
  loadingStats = false;
  loadingChart = false;
  loadingSeances = false;

  // États d'erreur
  errorStats = false;
  errorChart = false;
  errorSeances = false;

  constructor(
    private seanceService: SeanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Dashboard initialisé');
    this.chargerStatistiques();
    this.chargerGraphique();
    this.chargerSeancesRecentes();
  }

  chargerStatistiques() {
    if (this.loadingStats) return; // Éviter les appels multiples
    
    this.loadingStats = true;
    this.errorStats = false;
    
    console.log('Chargement des statistiques...');
    
    this.seanceService.getStatistiques().subscribe({
      next: (stats: Statistiques) => {
        console.log('Statistiques reçues:', stats);
        this.statCards[0].value = stats.totalSeances.toString();
        this.statCards[1].value = stats.dureeTotale;
        this.statCards[2].value = stats.totalExercices.toString();
        this.loadingStats = false;
        console.log('Statistiques mises à jour, loadingStats =', this.loadingStats);
        this.cdr.detectChanges(); // Forcer la détection des changements
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.loadingStats = false;
        this.errorStats = true;
        // Utiliser des données par défaut en cas d'erreur
        this.statCards[0].value = '0';
        this.statCards[1].value = '0h 0m';
        this.statCards[2].value = '0';
        this.cdr.detectChanges();
      }
    });
  }

  chargerGraphique() {
    if (this.loadingChart) return; // Éviter les appels multiples
    
    this.loadingChart = true;
    this.errorChart = false;
    
    console.log('Chargement du graphique...');
    
    this.seanceService.getStatistiquesMensuelles().subscribe({
      next: (statsMensuelles: StatistiqueMensuelle[]) => {
        console.log('Données graphique reçues:', statsMensuelles);
        const donnees = new Array(12).fill(0);
        statsMensuelles.forEach(stat => {
          donnees[stat.mois - 1] = stat.nombreSeances;
        });
        
        this.graphData = donnees;
        this.loadingChart = false;
        console.log('Graphique mis à jour, loadingChart =', this.loadingChart);
        this.cdr.detectChanges(); // Forcer la détection des changements
      },
      error: (error) => {
        console.error('Erreur lors du chargement du graphique:', error);
        this.loadingChart = false;
        this.errorChart = true;
        // Utiliser des données par défaut en cas d'erreur
        this.graphData = new Array(12).fill(0);
        this.cdr.detectChanges();
      }
    });
  }

  chargerSeancesRecentes() {
    if (this.loadingSeances) return; // Éviter les appels multiples
    
    this.loadingSeances = true;
    this.errorSeances = false;
    
    console.log('Chargement des séances récentes...');
    
    this.seanceService.getSeancesRecentes().subscribe({
      next: (seances: Seance[]) => {
        console.log('Séances récentes reçues:', seances);
        this.seances = seances;
        this.loadingSeances = false;
        console.log('Séances mises à jour, loadingSeances =', this.loadingSeances);
        this.cdr.detectChanges(); // Forcer la détection des changements
      },
      error: (error) => {
        console.error('Erreur lors du chargement des séances récentes:', error);
        this.loadingSeances = false;
        this.errorSeances = true;
        // Utiliser une liste vide en cas d'erreur
        this.seances = [];
        this.cdr.detectChanges();
      }
    });
  }

  // Méthode pour calculer la durée d'une séance (estimation basée sur le nombre d'exercices)
  calculerDureeSeance(seance: Seance): number {
    return seance.exercices.length * 5; // 5 minutes par exercice en moyenne
  }

  // Méthode pour recharger les données (en cas d'erreur)
  rechargerDonnees() {
    console.log('Rechargement des données...');
    this.chargerStatistiques();
    this.chargerGraphique();
    this.chargerSeancesRecentes();
  }

  // Méthode pour gérer la sélection d'une séance
  onSeanceSelected(seance: Seance) {
    console.log('Séance sélectionnée:', seance);
    // Ici vous pouvez ajouter la logique pour afficher les détails de la séance
    // Par exemple, ouvrir une modal ou naviguer vers une page de détails
  }

  // Méthode pour gérer la suppression d'une séance
  onSeanceDeleted(seanceId: string) {
    console.log('Suppression de la séance:', seanceId);
    
    this.seanceService.deleteSeance(seanceId).subscribe({
      next: (response) => {
        console.log('Séance supprimée avec succès:', response);
        
        // Retirer la séance de la liste locale
        this.seances = this.seances.filter(seance => 
          seance._id !== seanceId && seance.id !== seanceId
        );
        
        // Recharger les statistiques et le graphique
        this.chargerStatistiques();
        this.chargerGraphique();
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        // Ici vous pourriez afficher un message d'erreur à l'utilisateur
      }
    });
  }
}