import { Component,OnInit,OnDestroy,AfterViewInit,ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReservationBarComponent } from '../reservation-bar/reservation-bar.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule,MatIconModule,ReservationBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
