import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin-page',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@carrent.com', [Validators.required, Validators.email]],
      motdePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, motdePasse } = this.loginForm.value;

      this.adminAuthService.login(email, motdePasse).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            // Rediriger vers le dashboard admin sécurisé
            this.router.navigate(['/carrent-admin-ops-x7k9']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erreur de connexion';
        }
      });
    }
  }

  // Getter pour faciliter l'accès aux contrôles du formulaire
  get email() { return this.loginForm.get('email'); }
  get motdePasse() { return this.loginForm.get('motdePasse'); }
}
