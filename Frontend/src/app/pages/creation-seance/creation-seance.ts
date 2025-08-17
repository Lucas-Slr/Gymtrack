import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { SeanceService } from '../../services/seance';
import { SeanceEditService } from '../../services/seance-edit.service';
import { AuthService } from '../../services/auth.service';
import { Seance } from '../../models/seance.model';
import { Exercice } from '../../models/exercice.model';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-creation-seance',
  templateUrl: './creation-seance.html',
  styleUrl: './creation-seance.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconComponent, RouterModule]
})
export class CreationSeance implements OnInit {
  seanceForm: FormGroup;
  exerciceForm: FormGroup;
  exercices: Exercice[] = [];
  isSaving = false;
  errorMessage = '';
  isModification = false;
  seanceAModifier: Seance | null = null;
  seanceEnCours: Seance | null = null;
  isLoading = true;

  constructor(
    private fb: FormBuilder, 
    private seanceService: SeanceService,
    private seanceEditService: SeanceEditService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.seanceForm = this.fb.group({
      nom: ['', Validators.required],
      enregistree: [false] // nouvelle case à cocher pour enregistrer la séance
    });

    this.exerciceForm = this.fb.group({
      nom: ['', Validators.required],
      duree: [60, [Validators.required, Validators.min(1)]], // 60 secondes par défaut
      nombreSeries: [3, [Validators.required, Validators.min(1)]], // 3 séries par défaut
      tempsRepos: [90, [Validators.required, Validators.min(0)]] // 90 secondes par défaut
    });
  }

  ngOnInit() {
    // S'assurer que isLoading est initialisé
    this.isLoading = true;
    
    // Vérifier si on vient de la page des séances enregistrées avec une séance à modifier
    this.seanceAModifier = this.seanceEditService.getSeanceAModifier();
    if (this.seanceAModifier) {
      this.isModification = true;
      this.isLoading = false; // Pas besoin de vérification pour les modifications
      this.chargerSeanceAModifier();
      // Nettoyer le service après avoir récupéré les données
      this.seanceEditService.clearSeanceAModifier();
      this.cdr.detectChanges();
    } else {
      // Vérifier s'il y a une séance en cours seulement si ce n'est pas une modification
      this.verifierSeanceEnCours();
    }
  }

  verifierSeanceEnCours() {
    // Vérifier l'authentification
    if (!this.authService.isAuthenticated()) {
      this.isLoading = false;
      this.errorMessage = 'Vous devez être connecté pour créer une séance.';
      this.cdr.detectChanges();
      return;
    }
    
    // Ajouter un timeout pour éviter que la requête reste bloquée
    const timeout = setTimeout(() => {
      this.isLoading = false;
      this.errorMessage = 'Délai d\'attente dépassé lors de la vérification.';
      this.cdr.detectChanges();
    }, 10000); // 10 secondes de timeout
    
    this.seanceService.getSeanceEnCours().subscribe({
      next: (seance) => {
        clearTimeout(timeout);
        this.seanceEnCours = seance;
        this.isLoading = false;
        
        if (seance && !this.isModification) {
          this.errorMessage = `Une séance "${seance.nom}" est déjà en cours. Veuillez la terminer avant de créer une nouvelle séance.`;
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        clearTimeout(timeout);
        console.error('Erreur lors de la vérification de la séance en cours:', error);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la vérification des séances en cours.';
        this.cdr.detectChanges();
      }
    });
  }

  chargerSeanceAModifier() {
    if (this.seanceAModifier) {
      // Pré-remplir le formulaire
      this.seanceForm.patchValue({
        nom: this.seanceAModifier.nom,
        enregistree: false // Par défaut, la nouvelle version n'est pas enregistrée
      });

      // Charger les exercices
      this.exercices = [...this.seanceAModifier.exercices];
      
      console.log('Séance à modifier chargée:', this.seanceAModifier);
    }
  }

  ajouterExercice() {
    if (this.exerciceForm.valid) {
      const exercice: Exercice = {
        nom: this.exerciceForm.value.nom,
        duree: this.exerciceForm.value.duree,
        nombreSeries: this.exerciceForm.value.nombreSeries,
        tempsRepos: this.exerciceForm.value.tempsRepos
      };
      
      this.exercices.push(exercice);
      this.exerciceForm.reset({
        duree: 60,
        nombreSeries: 3,
        tempsRepos: 90
      });
    }
  }

  supprimerExercice(index: number) {
    this.exercices.splice(index, 1);
  }

  onSubmit() {
    // Vérifier s'il y a une séance en cours
    if (this.seanceEnCours && !this.isModification) {
      this.errorMessage = `Une séance "${this.seanceEnCours.nom}" est déjà en cours. Veuillez la terminer avant de créer une nouvelle séance.`;
      return;
    }

    if (this.seanceForm.valid && this.exercices.length > 0) {
      this.isSaving = true;
      this.errorMessage = '';

      const seance: Seance = {
        nom: this.seanceForm.value.nom,
        exercices: this.exercices,
        date: new Date(),
        enCours: true,
        enregistree: this.seanceForm.value.enregistree // ajouter la propriété enregistree
      };

      this.seanceService.addSeance(seance).subscribe({
        next: (response: Seance) => {
          console.log('Séance créée avec succès:', response);
          this.isSaving = false;
          // Redirection vers le dashboard ou la séance en cours
          this.router.navigate(['/seance-en-cours']);
        },
        error: (error: any) => {
          console.error('Erreur lors de la création de la séance:', error);
          this.errorMessage = 'Erreur lors de la sauvegarde de la séance. Veuillez réessayer.';
          this.isSaving = false;
        }
      });
    }
  }

  calculerDureeTotale(): number {
    if (this.exercices.length === 0) return 0;
    
    let dureeTotale = 0;
    this.exercices.forEach(exercice => {
      // Durée de l'exercice × nombre de séries
      dureeTotale += exercice.duree * exercice.nombreSeries;
      // Temps de repos entre les séries (sauf après la dernière série)
      dureeTotale += exercice.tempsRepos * (exercice.nombreSeries - 1);
    });
    
    // Convertir en minutes
    return Math.round(dureeTotale / 60);
  }
}
