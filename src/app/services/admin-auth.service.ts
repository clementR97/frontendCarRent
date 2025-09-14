// src/app/services/admin-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiUrl } from '../../environments/environment';
export interface AdminUser {
  id: string;
  nom: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AdminUser;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
   private apiUrl = ApiUrl.ApiUrl+'/api/admin';
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    // Vérifier si admin déjà connecté au démarrage
    this.checkExistingToken();
  }

  // Login admin
  login(email: string, motdePasse: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      motdePasse
    }).pipe(
      tap(response => {
        if (response.success) {
          // Stocker le token et les infos admin
          localStorage.setItem('admin_token', response.token);
          localStorage.setItem('admin_user', JSON.stringify(response.admin));
          this.currentAdminSubject.next(response.admin);
        }
      })
    );
  }

  // Logout admin
  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.currentAdminSubject.next(null);
  }

  // Vérifier si admin connecté
  isAuthenticated(): boolean {
    const token = localStorage.getItem('admin_token');
    if (!token) return false;

    // Vérifier si token expiré (basique)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  // Récupérer l'admin actuel
  getCurrentAdmin(): AdminUser | null {
    const adminData = localStorage.getItem('admin_user');
    return adminData ? JSON.parse(adminData) : null;
  }

  // Vérifier token existant au démarrage
  private checkExistingToken(): void {
    if (this.isAuthenticated()) {
      const admin = this.getCurrentAdmin();
      if (admin) {
        this.currentAdminSubject.next(admin);
      }
    }
  }
}