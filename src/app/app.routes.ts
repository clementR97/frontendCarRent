import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
 import {ConnexionUserComponent} from './connexion-user/connexion-user.component';
 import {InscriptionUserComponent} from './inscription-user/inscription-user.component';
 import {AuthComponent} from './auth/auth.component';
export const routes: Routes = [
   {path:'',component: HomeComponent},
   {path:'connexion',component:ConnexionUserComponent},
   {path:'inscription',component:InscriptionUserComponent},
   {path: 'redirectionSubcribe',component:AuthComponent}
];
