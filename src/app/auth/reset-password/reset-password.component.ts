
import { Component, OnInit,EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {SupabaseAuthService} from '../../services/supabase-auth.service';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,ReactiveFormsModule,MatIconModule,RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  passwordForm!:FormGroup;
  isLoading = false;
  showSuccessMessage = false;
  generalError = '';
  
  successMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private router:Router,
    private authService: SupabaseAuthService
  )
  {}

  ngOnInit(): void {
    this.initializeForm();
  }
  
  private initializeForm(){
    this.passwordForm = this.fb.group({
      email:['',[
        Validators.required,
        Validators.email
      ]]
    });
  }

  async passwordforgot(): Promise<void>{
    console.log('🚀 debut reset password');

 if(this.passwordForm.invalid){
  console.log('❌ Formiulaire invalide');
  this.markFormGroupTouched();
  return;
 }
 this.isLoading = true;
 this.generalError = '';
 this.showSuccessMessage = false;
 this.successMessage = null;
 try{
  const email = this.passwordForm.get('email')?.value;
  console.log('✉️ Email:',email);
  const result = await this.authService.resetPassword(email);
  console.log('📨 resultat:',result);
  if(result.success){
    this.showSuccessMessage = true;
    this.successMessage  = result.message ?? null;
    this.passwordForm.disable();
  }
  else{
    this.generalError = result.error || 'une erreur est survenue';
  }
 }
 catch(error:any){
  // console.log('erreur de réinitialisation du mot de passe:',error);
  console.error('💥 Erreur:',error);
  this.generalError = 'Une erreur inattendue est survenue.Veuillez réessayer.';
 }finally{
  this.isLoading = false;
 }
  }


  
  goToSubmit(event: Event): void {
    event.preventDefault();
    console.log('Redirection vers connexion');
     this.router.navigate(['/auth/login']);
  }
  goToHome():void{
    console.log('redirection vers home');
    this.router.navigate(['/']);
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

  // Méthode pour réessayer l'envoi
  retryReset(): void {
    this.showSuccessMessage = false;
    this.generalError = '';
    this.passwordForm.enable();
  }

}
