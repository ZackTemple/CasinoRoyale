import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Casino Royale';
  // loggedIn = false;
  loggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): any {
    this.authService.loggedIn$.subscribe(
      loginQ => this.loggedIn = loginQ
    );
  }

// how to refactor this code (same as in Personal Account component)
  onLogoutClick(): any {

    localStorage.removeItem('Authorization');
    this.loggedIn = false;
    this.authService.loggedIn$.next(false);
    console.log(localStorage.getItem('Authorization'));
    this.router.navigate(['/home']);
  }

}
