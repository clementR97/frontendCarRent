import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseAuthService } from '../../services/supabase-auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-update-password',
  imports: [CommonModule,ReactiveFormsModule,MatIconModule,RouterModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
// export class UpdatePasswordComponent implements OnInit{

//   passwordForm!: FormGroup;
//   isLoading = false;
//   showSuccessMessage = false;
//   hasError = false;
//   generalError = '';
//   successMessage : string | null = null;
//   showPassword = false;
//   showConfirmPassword = false;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private route: ActivatedRoute,
//     private authService: SupabaseAuthService
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//     this.checkResetToken();
//   }

//   private initializeForm(): void {
//     this.passwordForm = this.fb.group({
//       password: ['', [
//         Validators.required,
//         Validators.minLength(6)
//       ]],
//       confirmPassword: ['', [
//         Validators.required
//       ]]
//     }, { 
//       validators: this.passwordMatchValidator 
//     });
//   }

//   private checkResetToken(): void {
//     // Vérifier si on a bien les paramètres nécessaires dans l'URL
//     this.route.fragment.subscribe(fragment => {
//       if (!fragment || !fragment.includes('access_token')) {
//         this.hasError = true;
//       }
//     });
//   }

//   // Validator personnalisé pour vérifier que les mots de passe correspondent
//   private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
//     const password = control.get('password');
//     const confirmPassword = control.get('confirmPassword');

//     if (!password || !confirmPassword) {
//       return null;
//     }

//     if (password.value !== confirmPassword.value) {
//       confirmPassword.setErrors({ passwordMismatch: true });
//       return { passwordMismatch: true };
//     }

//     // Enlever l'erreur si les mots de passe correspondent
//     if (confirmPassword.errors) {
//       delete confirmPassword.errors['passwordMismatch'];
//       if (Object.keys(confirmPassword.errors).length === 0) {
//         confirmPassword.setErrors(null);
//       }
//     }

//     return null;
//   }

//   async updatePassword(): Promise<void> {
//     if (this.passwordForm.invalid) {
//       this.markFormGroupTouched();
//       return;
//     }

//     this.isLoading = true;
//     this.generalError = '';
//     this.successMessage = null;
//     try {
//       const newPassword = this.passwordForm.get('password')?.value;
//       const result = await this.authService.updatePassword(newPassword);

//       if (result.success) {
//         this.showSuccessMessage = true;
//         this.successMessage = result.message ?? null;
//       } else {
//         this.generalError = result.error || 'Une erreur est survenue';
//       }
//     } catch (error: any) {
//       console.error('Erreur lors de la mise à jour:', error);
//       this.generalError = 'Une erreur inattendue est survenue. Veuillez réessayer.';
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   // Méthodes utilitaires
//   isFieldInvalid(fieldName: string): boolean {
//     const field = this.passwordForm.get(fieldName);
//     return !!(field && field.invalid && (field.dirty || field.touched));
//   }

//   private markFormGroupTouched(): void {
//     Object.keys(this.passwordForm.controls).forEach(key => {
//       const control = this.passwordForm.get(key);
//       control?.markAsTouched();
//     });
//   }

//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPasswordVisibility(): void {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   goToHome(): void {
//     this.router.navigate(['/']);
//   }

//   goToLogin(): void {
//     this.router.navigate(['/auth/login']);
//   }

//   goToResetPassword(): void {
//     this.router.navigate(['/auth/reset-password']);
//   }

// }

export class UpdatePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  isLoading = false;
  isCheckingAuth = true;
  showSuccessMessage = false;
  hasError = false;
  generalError = '';
  successMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  
  private sessionSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: SupabaseAuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkAuthStatus();
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
  }

  private initializeForm(): void {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  private checkAuthStatus(): void {
    console.log('🔍 Vérification du statut d\'authentification...');
    
    // Attendre que le service d'auth soit initialisé
    this.sessionSubscription = this.authService.loading$.subscribe(isLoading => {
      if (!isLoading) {
        // Le service est initialisé, vérifier la session
        const session = this.authService.session;
        const user = this.authService.currentUser;
        
        console.log('📊 Session actuelle:', session);
        console.log('👤 Utilisateur actuel:', user);

        if (!session || !user) {
          console.log('❌ Pas de session valide');
          this.hasError = true;
          this.isCheckingAuth = false;
          return;
        }

        // Vérifier si c'est une session récente (probablement d'un reset password)
        const lastSignInAt = new Date(user.last_sign_in_at || '');
        const now = new Date();
        const timeDiff = now.getTime() - lastSignInAt.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        console.log('⏰ Dernière connexion il y a', minutesDiff.toFixed(1), 'minutes');

        if (minutesDiff > 30) { // 30 minutes de grâce
          console.log('⏰ Session trop ancienne pour un reset password');
          this.hasError = true;
        } else {
          console.log('✅ Session valide pour reset password');
          this.hasError = false;
        }
        
        this.isCheckingAuth = false;
      }
    });
  }

  // Validator personnalisé pour vérifier que les mots de passe correspondent
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Enlever l'erreur si les mots de passe correspondent
    if (confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  async updatePassword(): Promise<void> {
    console.log('🔄 Tentative de mise à jour du mot de passe...');
    
    if (this.passwordForm.invalid) {
      console.log('❌ Formulaire invalide');
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.generalError = '';
    this.successMessage = null;
    try {
      const newPassword = this.passwordForm.get('password')?.value;
      console.log('🔐 Mise à jour du mot de passe...');
      
      const result = await this.authService.updatePassword(newPassword);
      console.log('📨 Résultat mise à jour:', result);

      if (result.success) {
        this.showSuccessMessage = true;
        this.successMessage = result.message ?? null;
        console.log('✅ Mot de passe mis à jour avec succès');
      } else {
        this.generalError = result.error || 'Une erreur est survenue';
        console.log('❌ Erreur:', result.error);
      }
    } catch (error: any) {
      console.error('💥 Erreur lors de la mise à jour:', error);
      this.generalError = 'Une erreur inattendue est survenue. Veuillez réessayer.';
    } finally {
      this.isLoading = false;
    }
  }

  // Méthodes utilitaires
  isFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.passwordForm.controls).forEach(key => {
      const control = this.passwordForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToResetPassword(): void {
    this.router.navigate(['/auth/reset-password']);
  }
}