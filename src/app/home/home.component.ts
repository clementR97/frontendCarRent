import { Component,OnInit,OnDestroy,AfterViewInit,ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReservationBarComponent } from '../reservation-bar/reservation-bar.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
 import {FooterComponent} from "../footer/footer.component";
@Component({
  selector: 'app-home',
  imports: [CommonModule,MatIconModule,ReservationBarComponent,RouterModule,HeaderComponent,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
