import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {SupabaseAuthService} from '../services/supabase-auth.service'
@Component({
  selector: 'app-inscription-user',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './inscription-user.component.html',
  styleUrls: ['./inscription-user.component.scss']
})
export class InscriptionUserComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showSuccessMessage = false;
  generalError: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: SupabaseAuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkIfAlreadyAuthenticated();
  }

  private initializeForm(): void {
    this.signupForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordsMatchValidator 
    });
  }

  // Vérifier si l'utilisateur est déjà connecté
  private checkIfAlreadyAuthenticated(): void {
    if (this.authService.isAuthenticated) {
      // this.router.navigate(['/dashboard']);
      console.log("utilisateur deja connecter");
    }
  }

  // Validateur de correspondance des mots de passe
  passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Vérifier si un champ est invalide
  isFieldInvalid(field: string): boolean {
    const control = this.signupForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Basculer la visibilité du mot de passe
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // INSCRIPTION - Supabase gère TOUT automatiquement
  async onSubmit(): Promise<void> {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.generalError = null;
    this.successMessage = null;

    const { nom, prenom, email, password } = this.signupForm.value;

    // Utilisation du service - Supabase fait le reste
    const result = await this.authService.signUp(email, password, { nom, prenom });

    this.isLoading = false;

    if (result.success) {
      this.showSuccessMessage = true;
      this.successMessage = result.message ?? null;

      if (result.needsEmailConfirmation) {
        // Email de confirmation nécessaire
        setTimeout(() => {
          this.router.navigate(['/redirectionSubcribe'], {
            queryParams: { email }
            
          });
          console.log("vous etes enregistrer avec confirmation de mail");
        }, 3000);
      } else {
        // Compte activé immédiatement (si email confirmation désactivée)
        setTimeout(() => {
          // this.router.navigate(['/dashboard']);
          console.log("vous etes enregistrer sans conpfirmation mail");
        }, 2000);
      }
    } else {
      this.generalError = result.error ?? null;
    }
  }

  // Renvoyer l'email de confirmation
  async resendConfirmation(): Promise<void> {
    const email = this.signupForm.get('email')?.value;
    if (!email) return;

    this.isLoading = true;
    const result = await this.authService.resendConfirmation(email);
    this.isLoading = false;

    if (result.success) {
      this.successMessage = result.message ?? null;
      this.generalError = null;
    } else {
      this.generalError = result.error ?? null;
    }
  }

  // Navigation vers la connexion
  onConnection(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/connexion']);
  }

  // Navigation vers l'accueil
  goToHome(): void {
    this.router.navigate(['/']);
  }
}