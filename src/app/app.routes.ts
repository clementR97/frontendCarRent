import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
 import {ConnexionUserComponent} from './connexion-user/connexion-user.component';
export const routes: Routes = [
   {path:'',component: HomeComponent},
   {path:'connexion',component:ConnexionUserComponent}
];
