import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterData } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule]
})
export class Register {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(13), Validators.max(120)]],
      poids: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      taille: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch()) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData: RegisterData = {
        nom: this.registerForm.get('nom')?.value,
        prenom: this.registerForm.get('prenom')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        age: this.registerForm.get('age')?.value,
        poids: this.registerForm.get('poids')?.value,
        taille: this.registerForm.get('taille')?.value
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log('Erreur complète:', error);
          
          // Essayer d'extraire le message d'erreur de différentes façons
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.error && error.error.errors) {
            this.errorMessage = error.error.errors.map((err: any) => err.msg).join(', ');
          } else if (error.message) {
            this.errorMessage = error.message;
          } else if (error.status === 400) {
            this.errorMessage = 'Données invalides';
          } else if (error.status === 409) {
            this.errorMessage = 'Un utilisateur avec cet email existe déjà';
          } else if (error.status === 500) {
            this.errorMessage = 'Erreur serveur, veuillez réessayer';
          } else {
            this.errorMessage = 'Erreur lors de l\'inscription';
          }
          
          console.log('Message d\'erreur affiché:', this.errorMessage);
          
          // Forcer la détection de changement
          this.cdr.detectChanges();
        }
      });
    }
  }
}
