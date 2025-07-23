import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [CommonModule,MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
sidebarOpen = false;
toggleSidebar(){
  this.sidebarOpen = !this.sidebarOpen;
}
}
