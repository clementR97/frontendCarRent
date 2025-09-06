// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-auth',
//   imports: [],
//   templateUrl: './auth.component.html',
//   styleUrl: './auth.component.scss'
// })
// export class AuthComponent {

// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-pending',
  standalone: true,
  imports: [CommonModule, MatIconModule],
     templateUrl: './auth.component.html',
     styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupération de l’email depuis queryParams
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || null;
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToConnexion(): void {
    this.router.navigate(['/auth/login']);
  }
}

