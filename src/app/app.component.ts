import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Casino Royale';
  signedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): any {
    this.authService.signedIn$.subscribe(
      signInQ => this.signedIn = signInQ
    );
  }

// how to refactor this code (same as in Personal Account component)
  onSignOutClick(): any {
    this.router.navigate(['/home']);
    this.authService.signOut();
    localStorage.removeItem('Authorization');
  }

}
