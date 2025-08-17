import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Seance } from '../../models/seance.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-seances-enregistrees-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    FormsModule,
    IconComponent
  ],
  template: `
    <div class="seances-table-container" [class.expanded]="isExpanded">
      <!-- En-tête avec recherche et bouton d'agrandissement -->
      <div class="table-header">
        <div class="search-section">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher une séance enregistrée</mat-label>
            <input 
              matInput 
              [(ngModel)]="searchTerm" 
              (input)="applyFilter()"
              placeholder="Nom de la séance ou exercices..."
            >
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        
        <div class="actions-section">
          <button 
            mat-mini-fab 
            class="expand-button"
            (click)="toggleExpanded()"
            [attr.aria-label]="isExpanded ? 'Réduire le tableau' : 'Agrandir le tableau'"
          >
            <mat-icon>{{ isExpanded ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
          </button>
        </div>
      </div>

      <!-- Tableau -->
      <div class="table-container mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort (matSortChange)="sortData($event)" class="seances-table">
          
          <!-- Colonne Nom -->
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Séance </th>
            <td mat-cell *matCellDef="let seance"> 
              <div>
                <div class="text-white font-medium">{{ seance.nom }}</div>
                <div class="text-gray-400 text-sm">Séance enregistrée</div>
              </div>
            </td>
          </ng-container>

          <!-- Colonne Exercices -->
          <ng-container matColumnDef="exercices">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Exercices </th>
            <td mat-cell *matCellDef="let seance"> 
              <div class="text-white">{{ seance.exercices.length }} exercice(s)</div>
              <div class="text-gray-400 text-sm">
                {{ getNomsExercices(seance.exercices) }}
              </div>
            </td>
          </ng-container>

          <!-- Colonne Durée -->
          <ng-container matColumnDef="duree">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Durée </th>
            <td mat-cell *matCellDef="let seance"> 
              <div class="text-white">{{ calculerDureeTotale(seance.exercices) }} min</div>
            </td>
          </ng-container>

          <!-- Colonne Date -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
            <td mat-cell *matCellDef="let seance"> 
              <div class="text-gray-300">{{ formaterDate(seance.date) }}</div>
            </td>
          </ng-container>

          <!-- Colonne Actions -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let seance">
              <div class="action-buttons">
                <!-- Bouton Play -->
                <button 
                  mat-icon-button 
                  class="action-button play-button" 
                  (click)="lancerSeance(seance)" 
                  title="Lancer la séance"
                >
                  <app-icon name="play" size="sm" className="text-white"></app-icon>
                </button>
                
                <!-- Bouton Modifier -->
                <button 
                  mat-icon-button 
                  class="action-button edit-button" 
                  (click)="modifierSeance(seance)" 
                  title="Modifier la séance"
                >
                  <app-icon name="edit" size="sm" className="text-white"></app-icon>
                </button>
                
                <!-- Bouton Supprimer -->
                <button 
                  mat-icon-button 
                  class="action-button delete-button" 
                  (click)="confirmerSuppression(seance)" 
                  title="Retirer de la liste"
                >
                  <app-icon name="delete" size="sm" className="text-white"></app-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>

          <!-- Ligne pour aucun résultat -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length">
              <div class="no-data-message">
                <mat-icon>search_off</mat-icon>
                <span>Aucune séance enregistrée trouvée</span>
              </div>
            </td>
          </tr>
        </table>

        <!-- Pagination -->
        <mat-paginator 
          [pageSizeOptions]="[5, 10, 25, 50]" 
          showFirstLastButtons
          aria-label="Sélectionner la page"
          class="custom-paginator">
        </mat-paginator>
      </div>

      <!-- Modal de confirmation de suppression -->
      <div *ngIf="showDeleteConfirm" class="delete-confirm-overlay">
        <div class="delete-confirm-modal">
          <div class="modal-header">
            <h3>Confirmer la suppression</h3>
          </div>
          <div class="modal-content">
            <p>Êtes-vous sûr de vouloir retirer <strong>"{{ seanceToDelete?.nom }}"</strong> de vos séances enregistrées ?</p>
            <p class="warning-text">Cette action est réversible - vous pourrez toujours la retrouver dans vos séances récentes.</p>
          </div>
          <div class="modal-actions">
            <button mat-button class="cancel-button" (click)="annulerSuppression()">
              Annuler
            </button>
            <button mat-raised-button class="delete-button" (click)="supprimerSeance()" [disabled]="deleting">
              <mat-icon *ngIf="!deleting">delete</mat-icon>
              <span *ngIf="deleting">Suppression...</span>
              <span *ngIf="!deleting">Retirer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .seances-table-container {
      transition: all 0.3s ease-in-out;
      background: #1f2937;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid rgba(52, 173, 0, 0.2);
    }

    .seances-table-container.expanded {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      border-radius: 0;
      padding: 32px;
      background: #111827;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    }

    .search-section {
      flex: 1;
      max-width: 400px;
    }

    .search-field {
      width: 100%;
    }

    /* ÉLIMINER COMPLÈTEMENT LES COULEURS VIOLETTES/ROSES */
    .search-field ::ng-deep * {
      color: inherit !important;
    }

    .search-field ::ng-deep .mat-mdc-form-field-flex {
      background: rgba(52, 173, 0, 0.1) !important;
      border-radius: 8px !important;
      border: 1px solid rgba(52, 173, 0, 0.3) !important;
    }

    .search-field ::ng-deep .mat-mdc-text-field-wrapper {
      background: transparent !important;
    }

    .search-field ::ng-deep .mat-mdc-form-field-label {
      color: #34ad00 !important;
    }

    .search-field ::ng-deep .mat-mdc-input-element {
      color: white !important;
    }

    .search-field ::ng-deep .mat-mdc-form-field-icon-suffix {
      color: #34ad00 !important;
    }

    /* FORCER TOUTES LES BORDURES EN VERT - ÉLIMINER VIOLET/ROSE */
    .search-field ::ng-deep .mat-mdc-form-field-outline,
    .search-field ::ng-deep .mat-mdc-form-field-outline-start,
    .search-field ::ng-deep .mat-mdc-form-field-outline-end,
    .search-field ::ng-deep .mat-mdc-form-field-outline-gap {
      border-color: rgba(52, 173, 0, 0.3) !important;
      color: rgba(52, 173, 0, 0.3) !important;
    }

    .search-field ::ng-deep .mat-mdc-form-field-outline-thick,
    .search-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline-thick {
      border-color: #34ad00 !important;
      color: #34ad00 !important;
    }

    /* Focus state - FORCER LE VERT */
    .search-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline-start,
    .search-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline-end,
    .search-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline-gap {
      border-color: #34ad00 !important;
    }

    /* ÉLIMINER LES COULEURS PAR DÉFAUT D'ANGULAR MATERIAL */
    .search-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-label {
      color: #34ad00 !important;
    }

    /* Bouton d'agrandissement */
    .expand-button {
      background: #34ad00 !important;
      color: white !important;
    }

    .expand-button:hover {
      background: #2d8f00 !important;
    }

    .table-container {
      background: #1f2937;
      border-radius: 12px;
      overflow: hidden;
    }

    .seances-table {
      width: 100%;
      background: transparent;
    }

    /* En-têtes du tableau */
    .seances-table ::ng-deep .mat-mdc-header-cell {
      background: #34ad00 !important;
      color: white !important;
      font-weight: 600;
      border-bottom: 1px solid rgba(52, 173, 0, 0.3);
    }

    /* Cellules du tableau */
    .seances-table ::ng-deep .mat-mdc-cell {
      color: white !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: #1f2937 !important;
    }

    /* Lignes du tableau */
    .seances-table ::ng-deep .mat-mdc-row {
      background: #1f2937 !important;
    }

    .seances-table ::ng-deep .mat-mdc-row:hover {
      background: rgba(52, 173, 0, 0.1) !important;
    }

    /* Boutons d'action */
    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .action-button {
      width: 36px !important;
      height: 36px !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .play-button {
      background: #34ad00 !important;
      color: white !important;
    }

    .play-button:hover {
      background: #2d8f00 !important;
    }

    .edit-button {
      background: #3b82f6 !important;
      color: white !important;
    }

    .edit-button:hover {
      background: #2563eb !important;
    }

    .delete-button {
      background: #ef4444 !important;
      color: white !important;
    }

    .delete-button:hover {
      background: #dc2626 !important;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .no-data-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 32px;
      color: rgba(255, 255, 255, 0.6);
    }

    .no-data-message mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    /* Styles pour la pagination - ÉLIMINER COMPLÈTEMENT LE BLANC */
    .custom-paginator ::ng-deep .mat-mdc-paginator {
      background: #1f2937 !important;
      color: white !important;
      border-top: 1px solid rgba(52, 173, 0, 0.3) !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-paginator-page-size-label,
    .custom-paginator ::ng-deep .mat-mdc-paginator-range-label {
      color: white !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-select-value {
      color: white !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-select-arrow {
      color: #34ad00 !important;
    }

    /* Dropdown de la pagination - FORCER LE NOIR */
    .custom-paginator ::ng-deep .mat-mdc-select-panel {
      background: #1f2937 !important;
      color: white !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-option {
      color: white !important;
      background: #1f2937 !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-option:hover {
      background: rgba(52, 173, 0, 0.1) !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-option.mat-mdc-option-active {
      background: rgba(52, 173, 0, 0.2) !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-option.mat-mdc-selected {
      background: #34ad00 !important;
      color: white !important;
    }

    /* Boutons de navigation de la pagination */
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-previous,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-next,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-first,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-last {
      color: #34ad00 !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-previous:hover,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-next:hover,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-first:hover,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-last:hover {
      background: rgba(52, 173, 0, 0.1) !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-previous:disabled,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-next:disabled,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-first:disabled,
    .custom-paginator ::ng-deep .mat-mdc-paginator-navigation-last:disabled {
      color: rgba(255, 255, 255, 0.3) !important;
    }

    /* Éliminer TOUS les éléments blancs de la pagination */
    .custom-paginator ::ng-deep .mat-mdc-paginator-container {
      background: #1f2937 !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-paginator-page-size {
      background: #1f2937 !important;
    }

    .custom-paginator ::ng-deep .mat-mdc-paginator-range-actions {
      background: #1f2937 !important;
    }

    /* Modal de confirmation de suppression */
    .delete-confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .delete-confirm-modal {
      background: #1f2937;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .modal-header h3 {
      color: white;
      margin: 0 0 16px 0;
      font-size: 18px;
    }

    .modal-content p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 12px 0;
      line-height: 1.5;
    }

    .warning-text {
      color: #ef4444 !important;
      font-weight: 500;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .cancel-button {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    .cancel-button:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }

    .delete-button {
      background: #ef4444 !important;
      color: white !important;
    }

    .delete-button:hover {
      background: #dc2626 !important;
    }

    .delete-button:disabled {
      background: rgba(239, 68, 68, 0.5) !important;
    }

    /* Animation pour l'agrandissement */
    @keyframes expandTable {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(1.02);
        opacity: 1;
      }
    }

    .seances-table-container.expanded {
      animation: expandTable 0.3s ease-in-out;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .table-header {
        flex-direction: column;
        align-items: stretch;
      }

      .search-section {
        max-width: none;
      }

      .seances-table-container.expanded {
        padding: 16px;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SeancesEnregistreesTableComponent implements OnInit {
  @Input() seances: Seance[] = [];
  @Output() seanceLancee = new EventEmitter<Seance>();
  @Output() seanceModifiee = new EventEmitter<Seance>();
  @Output() seanceSupprimee = new EventEmitter<string>();
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Seance>([]);
  displayedColumns: string[] = ['nom', 'exercices', 'duree', 'date', 'actions'];
  searchTerm = '';
  isExpanded = false;
  
  // Variables pour la suppression
  showDeleteConfirm = false;
  seanceToDelete: Seance | null = null;
  deleting = false;

  ngOnInit() {
    this.dataSource.data = this.seances;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    // Configuration du tri personnalisé
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'nom': return (item.nom || '').toLowerCase();
        case 'date': return new Date(item.date).getTime();
        case 'exercices': return item.exercices.length;
        case 'duree': return this.calculerDureeTotale(item.exercices);
        default: return '';
      }
    };
  }

  applyFilter() {
    const filterValue = this.searchTerm.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.dataSource.sort = this.sort;
    }
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

  getNomsExercices(exercices: any[]): string {
    return exercices.map(e => e.nom).join(', ');
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    
    // Empêcher le scroll du body quand le tableau est agrandi
    if (this.isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  lancerSeance(seance: Seance) {
    this.seanceLancee.emit(seance);
  }

  modifierSeance(seance: Seance) {
    this.seanceModifiee.emit(seance);
  }

  confirmerSuppression(seance: Seance) {
    this.seanceToDelete = seance;
    this.showDeleteConfirm = true;
  }

  annulerSuppression() {
    this.showDeleteConfirm = false;
    this.seanceToDelete = null;
  }

  supprimerSeance() {
    if (!this.seanceToDelete) return;
    
    this.deleting = true;
    this.seanceSupprimee.emit(this.seanceToDelete._id || this.seanceToDelete.id);
    
    // Fermer la modal après un court délai
    setTimeout(() => {
      this.showDeleteConfirm = false;
      this.seanceToDelete = null;
      this.deleting = false;
    }, 1000);
  }
}
