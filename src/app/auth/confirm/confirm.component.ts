import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseAuthService } from '../../services/supabase-auth.service';
@Component({
  selector: 'app-confirm',
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
 export class ConfirmComponent implements OnInit{
 loading = true;
 error = '';
 success = '';
 constructor(
   private router: Router,
   private route: ActivatedRoute,
   private supabase: SupabaseAuthService
 ){}
//   async ngOnInit() {
//     try{
      
//       const fragment = window.location.hash;

//       if(fragment){
//          // Parse les paramètres du fragment (#access_token=...&type=signup)
//          const params = new URLSearchParams(fragment.substring(1));
//          const accessToken = params.get('access_token');
//          const type = params.get('type');

//          if(accessToken && type ==='singup'){
//           this.success = 'Compte confirmé avec succès !';
//           setTimeout(() => {
//             this.router.navigate(['/auth/login'], {
//               queryParams: { message: 'Compte confirmé ! Vous pouvez maintenant vous connecter.' }
//             });
//           }, 2000);
//          }
//       }
//       else{
//         const token = this.route.snapshot.queryParamMap.get('token');
//       const type = this.route.snapshot.queryParamMap.get('type');

//        if (token && type === 'signup') {
//         const {error} = await (this.supabase as any).supabase.auth.verifyOtp({
//           token_hash: token,
//          type: 'signup'
//         });
//         if(error)throw error;
//         this.router.navigate(['/auth/login'],{
//           queryParams: {message:'Compte confirmer avec succes! vous pouvez vous connecter'}
//         });

//       }
    
//     }
//   }catch (error:any){
//     this.error = error.message;
//   }finally{
//     this.loading = false;
//   }
// }
//   GoToLogin(){
//     this.router.navigate(['/auth/login'])
//   }
// }

async ngOnInit() {
  try {
    // Juste attendre et rediriger
    this.success = 'Confirmation reçue, redirection...';
    
    setTimeout(() => {
      this.router.navigate(['/auth/login'], {
        queryParams: { message: 'Email confirmé ! Essayez de vous connecter.' }
      });
    }, 2000);
    
  } catch (error: any) {
    this.error = 'Erreur lors de la confirmation';
  } finally {
    this.loading = false;
  }
}
GoToLogin(){
       this.router.navigate(['/auth/login'])
     }
 }