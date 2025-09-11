import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
 import {ConnexionUserComponent} from './auth/connexion-user/connexion-user.component';
 import {InscriptionUserComponent} from './auth/inscription-user/inscription-user.component';
 import {AuthComponent} from './auth/redirection-subscribe/auth.component';
 import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
 import {UpdatePasswordComponent} from './auth/update-password/update-password.component';
 import {AuthCallbackComponent} from './auth/auth-callback/auth-callback.component';
 import{ConfirmComponent} from './auth/confirm/confirm.component';
 import { GoogleCallbackComponent } from './auth/google-callback/google-callback.component';
 
 import { AdminGuard } from './admin_Zone/guards/admin.guard';
 import { AdminPageComponent} from './admin_Zone/admin-page/admin-page.component';

   
export const routes: Routes = [
   {path:'',component: HomeComponent},
   // partie connexion,inscription,forget,redirection,supabase,callback
   {path:'auth',
      children:[
         {path:'login',component:ConnexionUserComponent},
         {path:'signup',component:InscriptionUserComponent},
         {path:'redirection',component:AuthComponent},
         {path: 'reset-password',component:ResetPasswordComponent},
         {path:'update-password',component:UpdatePasswordComponent},
         {path:'callback-password',component:AuthCallbackComponent},
         {path:'confirm',component:ConfirmComponent},
         {path:'google-callback',component:GoogleCallbackComponent},
         
      ]
   },
   {path:'admin-login-ops-x7k9',component:AdminPageComponent,title:'Carrent Admin - Connexion'},
   {path:'carrent-admin-ops-x7k9',
       
      canActivate:[AdminGuard],
      title:'Carrent Admin - Dashboard',
      loadComponent: () => import('./admin_Zone/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent) // Lazy loading optionnel

   },
   // Redirection admin
  {
   path: 'admin',
   redirectTo: '/carrent-admin-ops-x7k9',
   pathMatch: 'full'
 },

 // Route wildcard (404) - toujours en dernier
 { path: '**', redirectTo: '' }

];
