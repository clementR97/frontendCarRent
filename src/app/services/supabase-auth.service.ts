import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService {
  private supabase: SupabaseClient;
  
  // Observables pour l'état d'authentification
  private _currentUser = new BehaviorSubject<User | null>(null);
  private _session = new BehaviorSubject<Session | null>(null);
  private _loading = new BehaviorSubject<boolean>(true);
  
  public readonly currentUser$: Observable<User | null> = this._currentUser.asObservable();
  public readonly session$: Observable<Session | null> = this._session.asObservable();
  public readonly loading$: Observable<boolean> = this._loading.asObservable();

  constructor(private router: Router) {
    // Configuration Supabase - Remplacez par vos vraies valeurs
    this.supabase = createClient(
      'https://pehsmndxkjqqlyrysfws.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlaHNtbmR4a2pxcWx5cnlzZndzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDY5MjYyNCwiZXhwIjoyMDY2MjY4NjI0fQ.d-EMYoLM4myP06qMyexXUewk-wHwcM3ipl9klbKbry8'
    );

    this.initializeAuth();
  }

  // Initialiser l'authentification
  private async initializeAuth(): Promise<void> {
    try {
      // Récupérer la session existante
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur récupération session:', error);
      } else {
        this.updateAuthState(session);
      }

      // Écouter les changements d'authentification
      this.supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔐 Auth State Changed:', event, session?.user?.email);
        this.updateAuthState(session);
        this.handleAuthEvents(event, session);
      });

    } finally {
      this._loading.next(false);
    }
  }

  // Mettre à jour l'état d'authentification
  private updateAuthState(session: Session | null): void {
    this._session.next(session);
    this._currentUser.next(session?.user ?? null);
  }

  // Gérer les événements d'authentification
  private handleAuthEvents(event: string, session: Session | null): void {
    switch (event) {
      case 'SIGNED_IN':
        console.log('✅ Utilisateur connecté');
        this.router.navigate(['/dashboard']);
        break;
        
      case 'SIGNED_OUT':
        console.log('👋 Utilisateur déconnecté');
        this.router.navigate(['/']);
        break;
        
      case 'SIGNED_UP':
        console.log('🎉 Nouvel utilisateur inscrit');
        // La redirection se fait après confirmation d'email
        break;
        
      case 'TOKEN_REFRESHED':
        console.log('🔄 Token rafraîchi');
        break;
    }
  }

  // INSCRIPTION - Supabase gère tout automatiquement
  async signUp(email: string, password: string, userData?: { nom: string; prenom: string }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password, // Supabase hash automatiquement le mot de passe
        options: {
          data: userData ? {
            nom: userData.nom.trim(),
            prenom: userData.prenom.trim(),
            full_name: `${userData.prenom.trim()} ${userData.nom.trim()}`
          } : undefined,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      return {
        success: true,
        data,
        needsEmailConfirmation: !data.user?.email_confirmed_at,
        message: data.user?.email_confirmed_at 
          ? 'Compte créé avec succès !' 
          : 'Un email de confirmation a été envoyé.'
      };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        data: null
      };
    }
  }

  // CONNEXION - Supabase gère l'authentification
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password // Supabase vérifie automatiquement le hash
      });

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Connexion réussie !'
      };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        data: null
      };
    }
  }

  // DÉCONNEXION
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;

      return {
        success: true,
        message: 'Déconnexion réussie'
      };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // RÉINITIALISATION DE MOT DE PASSE - Supabase envoie l'email automatiquement
  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`
        }
      );

      if (error) throw error;

      return {
        success: true,
        message: 'Email de réinitialisation envoyé !'
      };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // NOUVEAU MOT DE PASSE
  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword // Supabase hash automatiquement
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Mot de passe mis à jour avec succès !'
      };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // RENVOYER EMAIL DE CONFIRMATION
  async resendConfirmation(email: string) {
    try {
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase()
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Email de confirmation renvoyé !'
      };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Traduction des erreurs Supabase
  private getErrorMessage(error: any): string {
    const errorMessages: { [key: string]: string } = {
      'User already registered': 'Cette adresse email est déjà utilisée.',
      'Invalid email': 'Adresse email invalide.',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
      'Signup is disabled': 'Les inscriptions sont temporairement désactivées.',
      'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter.',
      'Invalid login credentials': 'Email ou mot de passe incorrect.',
      'Email rate limit exceeded': 'Trop de tentatives. Veuillez attendre avant de réessayer.',
      'User not found': 'Aucun compte trouvé avec cette adresse email.',
      'Invalid credentials': 'Identifiants invalides.',
      'Too many requests': 'Trop de tentatives. Veuillez patienter.',
    };

    return errorMessages[error.message] || 
           error.message || 
           'Une erreur est survenue.';
  }

  // Getters pour l'état actuel
  get currentUser(): User | null {
    return this._currentUser.value;
  }

  get session(): Session | null {
    return this._session.value;
  }

  get isAuthenticated(): boolean {
    return !!this._currentUser.value;
  }

  get isLoading(): boolean {
    return this._loading.value;
  }

  // Obtenir les données utilisateur depuis les métadonnées
  get userMetadata(): any {
    return this.currentUser?.user_metadata || {};
  }

  get userEmail(): string | undefined {
    return this.currentUser?.email;
  }

  get userName(): string {
    const metadata = this.userMetadata;
    return metadata?.full_name || 
           `${metadata?.prenom || ''} ${metadata?.nom || ''}`.trim() || 
           'Utilisateur';
  }
}