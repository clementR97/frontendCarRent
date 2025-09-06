import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
// import { SupabaseAuthService } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-google-callback',
  imports: [MatIconModule,CommonModule],
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.scss'
})
export class GoogleCallbackComponent implements OnInit{
  loadingMessage = 'Finalisation de la connexion Google...';
  loadingSubtitle = 'Veuillez patientez pendant que nous vous connectons';
  hasError = false;
  errorMessage = '';
  userInfo: any = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: SupabaseAuthService
  ){}
ngOnInit(): void {
  this.handleGoogleCallback();
}
private async handleGoogleCallback(): Promise<void> {

  try{
    console.log('Traitement du callback de google');
    // Attendre que Supabase traite la session OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Vérifier les erreurs dans l'URL
    this.route.fragment.subscribe(async (fragment) => {
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        const accessToken = params.get('access_token');

        console.log('📋 Google callback params:', { 
          error, 
          hasAccessToken: !!accessToken,
          errorDescription 
        });

        if (error) {
          console.error('❌ Erreur Google OAuth:', error, errorDescription);
          this.handleGoogleError(error, errorDescription);
          return;
        }

        if (accessToken) {
          await this.finalizeGoogleAuth();
        } else {
          // Fallback: essayer de récupérer la session courante
          await this.checkCurrentSession();
        }
      } else {
        // Pas de fragment, vérifier la session courante
        await this.checkCurrentSession();
      }
    });
  }catch(error:any){
    console.error('❌ Erreur dans handleGoogleCallback:', error);
    this.showError('Une erreur inattendue est survenue lors de la connexion Google.');
  }
}
private async finalizeGoogleAuth(): Promise<void> {
  try {
    this.loadingMessage = 'Récupération de vos informations...';
    
    // ✅ CORRECTION : Utiliser la méthode publique du service
    const result = await this.authService.handleAuthCallback();
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de la finalisation');
    }
    
    const user = this.authService.currentUser;
    if (user) {
      console.log('✅ Utilisateur Google connecté:', {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.['full_name']
      });

      this.userInfo = {
        email: user.email,
        name: user.user_metadata?.['full_name'] || user.user_metadata?.['name'],
        avatar: user.user_metadata?.['avatar_url'] || user.user_metadata?.['picture'],
        provider: 'Google'
      };

      this.loadingMessage = 'Connexion réussie !';
      this.loadingSubtitle = `Bienvenue ${this.userInfo.name || this.userInfo.email} !`;
      
      localStorage.setItem('google_auth_success', 'true');
      
      setTimeout(() => {
        console.log('🏠 Redirection vers dashboard...');
        this.router.navigate(['/dashboard'], {
          queryParams: { 
            welcome: 'true',
            provider: 'google' 
          }
        });
      }, 2000);

    } else {
      throw new Error('Aucun utilisateur trouvé après authentification Google');
    }

  } catch (error: any) {
    console.error('❌ Erreur finalisation Google auth:', error);
    this.showError('Impossible de finaliser la connexion Google. Veuillez réessayer.');
  }
}

private async checkCurrentSession(): Promise<void> {
  try {
    this.loadingMessage = 'Vérification de votre session...';
    
    // ✅ CORRECTION : Utiliser les getters publics du service
    if (this.authService.isAuthenticated && this.authService.session) {
      console.log('✅ Session Google trouvée');
      await this.finalizeGoogleAuth();
    } else {
      throw new Error('Aucune session Google trouvée');
    }

  } catch (error: any) {
    console.error('❌ Erreur vérification session:', error);
    this.showError('Session Google non trouvée. Veuillez réessayer la connexion.');
  }
}

private handleGoogleError(error: string, description?: string | null): void {
  let userMessage = '';

  switch (error) {
    case 'access_denied':
      userMessage = 'Connexion annulée. Vous avez refusé l\'accès à Google.';
      break;
    case 'invalid_request':
      userMessage = 'Requête invalide. Veuillez réessayer.';
      break;
    case 'temporarily_unavailable':
      userMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.';
      break;
    default:
      userMessage = description || 'Erreur lors de la connexion avec Google.';
  }

  this.showError(userMessage);
}

private showError(message: string): void {
  this.hasError = true;
  this.errorMessage = message;
  this.loadingMessage = 'Erreur de connexion';
  this.loadingSubtitle = '';
}

// Actions utilisateur
retryGoogleAuth(): void {
  console.log('🔄 Nouvelle tentative Google Auth...');
  this.router.navigate(['/auth/login']).then(() => {
    // Déclencher automatiquement Google Auth après navigation
    setTimeout(() => {
      // Tu peux émettre un événement ou appeler directement le service
      window.location.reload();
    }, 500);
  });
}

goToLogin(): void {
  console.log('↩️ Retour à la page de connexion');
  this.router.navigate(['/auth/login']);
}

goToDashboard(): void {
  console.log('🏠 Aller au dashboard');
  this.router.navigate(['/dashboard']);
}
}
