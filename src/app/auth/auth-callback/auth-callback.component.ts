import { Component, OnInit,EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {SupabaseAuthService} from '../../services/supabase-auth.service'
import {MatIconModule} from '@angular/material/icon';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  imports: [CommonModule,ReactiveFormsModule,MatIconModule,RouterModule],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
// export class AuthCallbackComponent implements OnInit{
//   loadingMessage = 'Vérification en cours...';
//   loadingSubtitle = 'Veuillez patienter pendant que nous confirmons votre identité.';
//   hasError = false;
//   errorMessage = '';

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private authService: SupabaseAuthService
//   ) {}
//   ngOnInit(): void {
//     this.handleAuthCallback();
//   }

//   private async handleAuthCallback(): Promise<void> {
//     try {
//       // Récupérer les paramètres de l'URL (fragment)
//       this.route.fragment.subscribe(async (fragment) => {
//         if (!fragment) {
//           this.showError('Lien invalide ou paramètres manquants.');
//           return;
//         }

//         const params = new URLSearchParams(fragment);
//         const accessToken = params.get('access_token');
//         const refreshToken = params.get('refresh_token');
//         const type = params.get('type');

//         if (!accessToken || !refreshToken) {
//           this.showError('Tokens d\'authentification manquants.');
//           return;
//         }

//         // Définir la session avec les tokens récupérés
//         await this.setSession(accessToken, refreshToken, type);
//       });

//     } catch (error) {
//       console.error('Erreur dans handleAuthCallback:', error);
//       this.showError('Une erreur inattendue est survenue.');
//     }
//   }

//   private async setSession(accessToken: string, refreshToken: string, type: string | null): Promise<void> {
//     try {
//       // Utiliser l'API Supabase pour définir la session
//       const { data, error } = await this.authService['supabase'].auth.setSession({
//         access_token: accessToken,
//         refresh_token: refreshToken
//       });

//       if (error) {
//         console.error('Erreur setSession:', error);
//         this.showError('Impossible de valider la session.');
//         return;
//       }

//       // Rediriger selon le type d'action
//       if (type === 'recovery') {
//         // C'est une réinitialisation de mot de passe
//         this.loadingMessage = 'Redirection vers la page de nouveau mot de passe...';
//         setTimeout(() => {
//           this.router.navigate(['/auth/update-password']);
//         }, 1500);
//       } else {
//         // Confirmation d'email ou autre
//         this.loadingMessage = 'Compte confirmé avec succès !';
//         setTimeout(() => {
//           this.router.navigate(['/dashboard']);
//         }, 1500);
//       }

//     } catch (error) {
//       console.error('Erreur lors de la définition de session:', error);
//       this.showError('Erreur lors de la validation de la session.');
//     }
//   }

//   private showError(message: string): void {
//     this.hasError = true;
//     this.errorMessage = message;
//   }

//   goToResetPassword(): void {
//     this.router.navigate(['/auth/reset-password']);
//   }
// }
export class AuthCallbackComponent implements OnInit {
  loadingMessage = 'Vérification en cours...';
  loadingSubtitle = 'Veuillez patienter pendant que nous confirmons votre identité.';
  hasError = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: SupabaseAuthService
  ) {}

  ngOnInit(): void {
    this.handleAuthCallback();
  }

  private async handleAuthCallback(): Promise<void> {
    try {
      // Vérifier d'abord s'il y a une erreur dans l'URL
      this.route.fragment.subscribe(async (fragment) => {
        if (fragment) {
          const params = new URLSearchParams(fragment);
          const error = params.get('error');
          const errorDescription = params.get('error_description');
          
          if (error) {
            console.error('Erreur dans callback:', error, errorDescription);
            if (error === 'access_denied' || errorDescription?.includes('expired')) {
              this.showError('Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.');
            } else {
              this.showError(errorDescription || 'Erreur d\'authentification.');
            }
            return;
          }
        }

        // Utiliser la méthode du service pour gérer le callback
        const result = await this.authService.handleAuthCallback();
        
        if (result.success) {
          if (result.type === 'recovery') {
            this.loadingMessage = 'Redirection vers la page de nouveau mot de passe...';
            setTimeout(() => {
              this.router.navigate(['/auth/update-password']);
            }, 1500);
          } else {
            this.loadingMessage = 'Authentification réussie !';
            setTimeout(() => {
              // this.router.navigate(['/dashboard']);
              console.log("vous etes connecter");
            }, 1500);
          }
        } else {
          this.showError(result.error || 'Erreur lors de l\'authentification.');
        }
      });

    } catch (error) {
      console.error('Erreur dans handleAuthCallback:', error);
      this.showError('Une erreur inattendue est survenue.');
    }
  }

  private showError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
  }

  goToResetPassword(): void {
    this.router.navigate(['/auth/reset-password']);
  }
}