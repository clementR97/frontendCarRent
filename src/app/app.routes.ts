import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
 import {ConnexionUserComponent} from './auth/connexion-user/connexion-user.component';
 import {InscriptionUserComponent} from './auth/inscription-user/inscription-user.component';
 import {AuthComponent} from './auth/auth.component';
 import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
 import {UpdatePasswordComponent} from './auth/update-password/update-password.component';
 import {AuthCallbackComponent} from './auth/auth-callback/auth-callback.component';
export const routes: Routes = [
   {path:'',component: HomeComponent},
   // {path:'connexion',component:ConnexionUserComponent},
   // {path:'inscription',component:InscriptionUserComponent},
   // {path: 'redirectionSubcribe',component:AuthComponent},
   // route pour les indentifiant
   {path:'auth',
      children:[
         {path:'login',component:ConnexionUserComponent},
         {path:'signup',component:InscriptionUserComponent},
         {path:'redirectionSubscribe',component:AuthComponent},
         {path: 'reset-password',component:ResetPasswordComponent},
         {path:'update-password',component:UpdatePasswordComponent},
         {path:'callback-password',component:AuthCallbackComponent}
      ]
   },

];
