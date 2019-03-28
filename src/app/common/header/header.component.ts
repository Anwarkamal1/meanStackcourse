import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  search(city: string) {
    city
      ? this.router.navigate([`/rentals/${city}/homes`])
      : this.router.navigate([`/rentals`]);
  }
}