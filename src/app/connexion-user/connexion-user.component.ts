import { Component, OnInit,EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
//import { Component, EventEmitter, Output, ChangeDetectionStrategy, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-connexion-user',
  imports: [CommonModule,ReactiveFormsModule,MatIconModule],
  templateUrl: './connexion-user.component.html',
  styleUrl: './connexion-user.component.scss'
})
// export class ConnexionUserComponent implements OnInit {
//   form!: FormGroup;

//   @Output() googleSignIn = new EventEmitter<void>();
//   @Output() appleSignIn = new EventEmitter<void>();
//   @Output() emailSignIn = new EventEmitter<{ email: string; password: string }>();

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.form = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }

//   onGoogle(): void {
//     this.googleSignIn.emit();
//     // TODO: Connecter Google OAuth (ex: via Supabase Auth)
//     console.log('Google OAuth: implémentez votre logique ici.');
//   }

//   onApple(): void {
//     this.appleSignIn.emit();
//     // TODO: Connecter Apple OAuth
//     console.log('Apple OAuth: implémentez votre logique ici.');
//   }

//   onSubmit(): void {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     this.emailSignIn.emit(this.form.value);
//   }
// }
export class ConnexionUserComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showSuccessMessage = false;
  generalError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.generalError = '';

      try {
        const formData = this.loginForm.value;
        console.log('Connexion classique:', formData);

        // Simulation d'authentification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);

      } catch (error: any) {
        this.generalError = error.message || 'Erreur de connexion';
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      this.isLoading = true;
      this.generalError = '';
      
      console.log('Connexion avec Google...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
      
    } catch (error: any) {
      this.generalError = 'Erreur lors de la connexion avec Google';
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithApple(): Promise<void> {
    try {
      this.isLoading = true;
      this.generalError = '';
      
      console.log('Connexion avec Apple...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
      
    } catch (error: any) {
      this.generalError = 'Erreur lors de la connexion avec Apple';
    } finally {
      this.isLoading = false;
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    console.log('Redirection vers mot de passe oublié');
    // this.router.navigate(['/forgot-password']);
  }

  onSignUp(event: Event): void {
    event.preventDefault();
    console.log('Redirection vers inscription');
     this.router.navigate(['/inscription']);
  }
  goToHome():void{
    
    console.log('redirection vers home');
    this.router.navigate(['/'])
  }
}