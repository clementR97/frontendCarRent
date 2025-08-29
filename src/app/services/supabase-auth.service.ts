import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environements/environement';
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
    
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey,
      {
        auth: {
          // Configuration pour éviter les conflits de session
          storage: window.localStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce' // Plus sécurisé
        }
      }
    );
    this.initializeAuth();
  }

  // Initialiser l'authentification
  private async initializeAuth(): Promise<void> {
    try {
      // Nettoyer les sessions en conflit
      await this.clearConflictingSessions();

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

    } catch (error) {
      console.error('Erreur initialisation auth:', error);
    } finally {
      this._loading.next(false);
    }
  }

  // Nettoyer les sessions en conflit
  private async clearConflictingSessions(): Promise<void> {
    try {
      // Supprimer les clés de session corrompues
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('supabase.auth.token') && key.includes('pehsmndxkjqqlyrysfws')
      );
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('Impossible de supprimer la clé:', key);
        }
      });
    } catch (error) {
      console.warn('Erreur nettoyage sessions:', error);
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
        break;
      case 'TOKEN_REFRESHED':
        console.log('🔄 Token rafraîchi');
        break;
      case 'PASSWORD_RECOVERY':
        console.log('🔑 Récupération de mot de passe');
        // Rediriger vers la page de nouveau mot de passe
        this.router.navigate(['/auth/update-password']);
        break;
    }
  }

  // INSCRIPTION
  async signUp(email: string, password: string, userData?: { nom: string; prenom: string }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: userData ? {
            nom: userData.nom.trim(),
            prenom: userData.prenom.trim(),
            full_name: `${userData.prenom.trim()} ${userData.nom.trim()}`
          } : undefined,
          emailRedirectTo: `${window.location.origin}/auth/callback-password`
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

  // CONNEXION
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
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
  //CONNEXION GOOGLE
  async loginWithGoogle(){
    try{
      const {data,error} = await this.supabase.auth.signInWithOAuth({
        provider:'google',
        options:{redirectTo: `${window.location.origin}/auth/callback`}
      });
      if(error)throw(error);
      return {success:true,data};
    }
    catch(error:any){
      console.error('Erreur Google Auth:',error);
      return{success:false, error:this.getErrorMessage(error)};
    }
  }

  //CONNEXION APPLE
  async loginWithApple(){
    try{
      const {data,error} = await this.supabase.auth.signInWithOAuth({
        provider:'apple',
        options:{redirectTo:`${window.location.origin}/auth/callback`}
      });
      if(error)throw(error);
      return {success:true,data};
    }catch(error:any){
      console.error('Erreur Apple Auth:',error);
      return{success:false,error:this.getErrorMessage(error)};
    }
  }

  // DÉCONNEXION
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;

      // Nettoyer le localStorage après déconnexion
      await this.clearConflictingSessions();

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

  // RÉINITIALISATION DE MOT DE PASSE - CORRIGÉE
  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          // ✅ URL CORRIGÉE - doit correspondre à votre route
          redirectTo: `${window.location.origin}/auth/callback-password`
        }
      );

      if (error) throw error;

      return {
        success: true,
        message: 'Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.'
      };
    } catch (error: any) {
      console.error('Erreur resetPassword:', error);
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
        password: newPassword
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Mot de passe mis à jour avec succès !'
      };
    } catch (error: any) {
      console.error('Erreur updatePassword:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // MÉTHODE POUR GÉRER LE CALLBACK D'AUTH - NOUVELLE
  async handleAuthCallback(): Promise<{ success: boolean; type?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur lors du callback:', error);
        return { 
          success: false, 
          error: this.getErrorMessage(error) 
        };
      }

      if (data.session) {
        console.log('✅ Session établie via callback');
        return { 
          success: true, 
          type: 'recovery' // Pour indiquer que c'est un reset password
        };
      }

      return { 
        success: false, 
        error: 'Aucune session trouvée' 
      };

    } catch (error: any) {
      console.error('Erreur handleAuthCallback:', error);
      return { 
        success: false, 
        error: 'Erreur lors du traitement du callback' 
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
      'Email link is invalid or has expired': 'Le lien email est invalide ou a expiré.',
      'otp_expired': 'Le lien de réinitialisation a expiré. Demandez un nouveau lien.',
      'access_denied': 'Accès refusé. Le lien est peut-être expiré.'
    };

    return errorMessages[error.message] ||
           errorMessages[error.error_description] ||
           error.message ||
           error.error_description ||
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