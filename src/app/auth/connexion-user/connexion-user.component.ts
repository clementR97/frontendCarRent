// import { Component, OnInit,EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
// import { ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// import {MatIconModule} from '@angular/material/icon';
// import { Router } from '@angular/router';
// //import { Component, EventEmitter, Output, ChangeDetectionStrategy, OnInit } from '@angular/core';
// //import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-connexion-user',
//   imports: [CommonModule,ReactiveFormsModule,MatIconModule,RouterModule],
//   templateUrl: './connexion-user.component.html',
//   styleUrl: './connexion-user.component.scss'
// })

// export class ConnexionUserComponent implements OnInit {
//   loginForm!: FormGroup;
//   isLoading = false;
//   showPassword = false;
//   showSuccessMessage = false;
//   generalError = '';

//   constructor(
//     private fb: FormBuilder,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initForm();
//   }

//   private initForm(): void {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       rememberMe: [false]
//     });
//   }

//   isFieldInvalid(fieldName: string): boolean {
//     const field = this.loginForm.get(fieldName);
//     return !!(field && field.invalid && field.touched);
//   }

//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }

//   async onSubmit(): Promise<void> {
//     if (this.loginForm.valid) {
//       this.isLoading = true;
//       this.generalError = '';

//       try {
//         //const formData = this.loginForm.value;
//         //console.log('Connexion classique:', formData);

//         // Simulation d'authentification
//         await new Promise(resolve => setTimeout(resolve, 2000));
        
//         this.showSuccessMessage = true;
//         setTimeout(() => {
//           // this.router.navigate(['/dashboard']);
//           console.log("vous etes connecter");
//         }, 1500);

//       } catch (error: any) {
//         this.generalError = error.message || 'Erreur de connexion';
//       } finally {
//         this.isLoading = false;
//       }
//     } else {
//       Object.keys(this.loginForm.controls).forEach(key => {
//         this.loginForm.get(key)?.markAsTouched();
//       });
//     }
//   }

//   async loginWithGoogle(): Promise<void> {
//     try {
//       this.isLoading = true;
//       this.generalError = '';
      
//       console.log('Connexion avec Google...');
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       this.showSuccessMessage = true;
//       setTimeout(() => {
//         this.router.navigate(['/dashboard']);
//       }, 1500);
      
//     } catch (error: any) {
//       this.generalError = 'Erreur lors de la connexion avec Google';
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   async loginWithApple(): Promise<void> {
//     try {
//       this.isLoading = true;
//       this.generalError = '';
      
//       console.log('Connexion avec Apple...');
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       this.showSuccessMessage = true;
//       setTimeout(() => {
//         this.router.navigate(['/dashboard']);
//       }, 1500);
      
//     } catch (error: any) {
//       this.generalError = 'Erreur lors de la connexion avec Apple';
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   onForgotPassword(event: Event): void {
//     event.preventDefault();
//     console.log('Redirection vers mot de passe oublié');
//      this.router.navigate(['/auth/reset-password']);
//   }

//   onSignUp(event: Event): void {
//     event.preventDefault();
//     console.log('Redirection vers inscription');
//      this.router.navigate(['/auth/signup']);
//   }
//   goToHome():void{
    
//     console.log('redirection vers home');
//     this.router.navigate(['/'])
//   }
// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

// ✅ IMPORT CRITIQUE - Votre service Supabase
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-connexion-user',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterModule],
  templateUrl: './connexion-user.component.html',
  styleUrl: './connexion-user.component.scss'
})
export class ConnexionUserComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showSuccessMessage = false;
  generalError = '';

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supabaseAuth: SupabaseAuthService // ✅ Injection du service
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkIfAlreadyLoggedIn();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // ✅ Vérifier si l'utilisateur est déjà connecté
  private checkIfAlreadyLoggedIn(): void {
    if (this.supabaseAuth.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ✅ CONNEXION SÉCURISÉE AVEC SUPABASE
  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.generalError = '';

      try {
        const { email, password } = this.loginForm.value;
        
        // ✅ Authentification réelle avec Supabase
        const result = await this.supabaseAuth.signIn(email, password);

        if (result.success) {
          this.showSuccessMessage = true;
          console.log('✅ Connexion réussie:', result.message);
          
          // La redirection se fait automatiquement via le service
          // grâce à l'événement 'SIGNED_IN' dans handleAuthEvents()
        } else {
          // ✅ Affichage de l'erreur réelle de Supabase
          this.generalError = result.error || 'Erreur de connexion';
          console.error('❌ Erreur connexion:', result.error);
        }

      } catch (error: any) {
        console.error('❌ Erreur connexion:', error);
        this.generalError = 'Erreur de connexion inattendue';
      } finally {
        this.isLoading = false;
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched();
    }
  }

  // ✅ CONNEXION GOOGLE SÉCURISÉE
  async loginWithGoogle(): Promise<void> {
    try {
      this.isLoading = true;
      this.generalError = '';
      
      console.log('🔄 Connexion avec Google...');
      const result = await this.supabaseAuth.loginWithGoogle();
      
      if (result.success) {
        console.log('✅ Redirection Google en cours...');
        // La redirection vers Google se fait automatiquement
        // Le callback reviendra sur /auth/callback
      } else {
        this.generalError = result.error || 'Erreur lors de la connexion avec Google';
        console.error('❌ Erreur Google Auth:', result.error);
      }
      
    } catch (error: any) {
      console.error('❌ Erreur Google Auth:', error);
      this.generalError = 'Erreur lors de la connexion avec Google';
    } finally {
      this.isLoading = false;
    }
  }

  // ✅ CONNEXION APPLE SÉCURISÉE
  async loginWithApple(): Promise<void> {
    try {
      this.isLoading = true;
      this.generalError = '';
      
      console.log('🔄 Connexion avec Apple...');
      const result = await this.supabaseAuth.loginWithApple();
      
      if (result.success) {
        console.log('✅ Redirection Apple en cours...');
        // La redirection vers Apple se fait automatiquement
        // Le callback reviendra sur /auth/callback
      } else {
        this.generalError = result.error || 'Erreur lors de la connexion avec Apple';
        console.error('❌ Erreur Apple Auth:', result.error);
      }
      
    } catch (error: any) {
      console.error('❌ Erreur Apple Auth:', error);
      this.generalError = 'Erreur lors de la connexion avec Apple';
    } finally {
      this.isLoading = false;
    }
  }

  // ✅ Marquer tous les champs comme touchés
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    console.log('Redirection vers mot de passe oublié');
    this.router.navigate(['/auth/reset-password']);
  }

  onSignUp(event: Event): void {
    event.preventDefault();
    console.log('Redirection vers inscription');
    this.router.navigate(['/auth/signup']);
  }

  goToHome(): void {
    console.log('Redirection vers home');
    this.router.navigate(['/']);
  }
}