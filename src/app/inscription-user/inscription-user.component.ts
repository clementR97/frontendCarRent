

import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { Component, OnInit,EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule,FormGroup, FormBuilder, Validators,AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-inscription-user',
  imports: [CommonModule,ReactiveFormsModule,MatIconModule],
  templateUrl: './inscription-user.component.html',
  styleUrls: ['./inscription-user.component.scss']
})
export class InscriptionUserComponent implements OnInit {

  signupForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showSuccessMessage = false;
  generalError: string | null = null;

  // Remplace par tes valeurs Supabase
  private supabase = createClient(
    'https://YOUR_PROJECT_ID.supabase.co',
    'YOUR_SUPABASE_ANON_KEY'
  );

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Vérifie que les 2 mots de passe sont identiques
  passwordsMatchValidator(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  // Vérifie si un champ est invalide et touché
  isFieldInvalid(field: string): boolean {
    const control = this.signupForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.generalError = null;

    const { nom, prenom, email, password } = this.signupForm.value;

    try {
      // Création de l'utilisateur avec Supabase Auth
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nom, prenom }
        }
      });

      if (error) throw error;

      // Insertion dans la table "clients" (si elle existe dans Supabase)
      await this.supabase.from('clients').insert({
        nom,
        prenom,
        email
      });

      this.showSuccessMessage = true;

      // Redirection après 2 sec
      setTimeout(() => {
        this.router.navigate(['/connexion']);
      }, 2000);

    } catch (err: any) {
      this.generalError = err.message || 'Une erreur est survenue.';
    } finally {
      this.isLoading = false;
    }
  }

  onConnection(event: Event): void {
    event.preventDefault();
    console.log('Redirection vers connexion');
     this.router.navigate(['/connexion']);
  }
  goToHome():void{
    console.log('redirection vers home');
    this.router.navigate(['/'])
  }
}
