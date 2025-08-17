import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { AuthService, User, ProfileUpdateData } from '../../services/auth.service';

interface UserStats {
  sessions: number;
  days: number;
  months: number;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, IconComponent],
  templateUrl: './profil.html',
  styleUrls: ['./profil.scss']
})
export class ProfilComponent implements OnInit {
  
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  user: User | null = null;
  stats: UserStats = {
    sessions: 0,
    days: 0,
    months: 0
  };

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(13), Validators.max(120)]],
      poids: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      taille: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      username: ['', [Validators.minLength(3), Validators.maxLength(30)]],
      aboutMe: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.data.user;
          this.populateForm();
          this.loadUserStats();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.errorMessage = 'Erreur lors du chargement du profil';
      }
    });
  }

  populateForm(): void {
    if (this.user) {
      this.profileForm.patchValue({
        nom: this.user.nom || '',
        prenom: this.user.prenom || '',
        email: this.user.email || '',
        age: this.user.age || '',
        poids: this.user.poids || '',
        taille: this.user.taille || '',
        username: this.user.username || '',
        aboutMe: this.user.aboutMe || ''
      });
    }
  }

  loadUserStats(): void {
    // TODO: Charger les vraies statistiques depuis le service
    // Pour l'instant, on utilise des valeurs par défaut
    this.stats = {
      sessions: 0,
      days: 0,
      months: 0
    };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Annuler les modifications en rechargeant les données
      this.populateForm();
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const profileData: ProfileUpdateData = this.profileForm.value;

      this.authService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.user = response.data.user;
            this.successMessage = 'Profil mis à jour avec succès';
            this.isEditing = false;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors de la mise à jour:', error);
          
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.error && error.error.errors) {
            this.errorMessage = error.error.errors.map((err: any) => err.msg).join(', ');
          } else {
            this.errorMessage = 'Erreur lors de la mise à jour du profil';
          }
          
          this.cdr.detectChanges();
        }
      });
    }
  }

  onEditPhoto(): void {
    // TODO: Implémenter la logique de modification de photo
    console.log('Modifier la photo de profil');
  }

  onSettingsClick(): void {
    // TODO: Ouvrir les paramètres avancés
    console.log('Ouvrir les paramètres');
  }

  onSocialMediaClick(platform: string): void {
    // TODO: Gérer les clics sur les réseaux sociaux
    console.log(`Clic sur ${platform}`);
  }

  get fullName(): string {
    if (this.user) {
      return `${this.user.prenom} ${this.user.nom}`;
    }
    return '';
  }

  get displayName(): string {
    if (this.user && this.user.username) {
      return this.user.username;
    }
    return this.fullName || 'Utilisateur';
  }

  get isFormValid(): boolean {
    return this.profileForm.valid && this.profileForm.dirty;
  }
}
