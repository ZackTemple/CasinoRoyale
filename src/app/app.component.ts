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
  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): any {
    this.authService.currentPlayer$.subscribe(user => {
      if (user === null) {
        this.loggedIn$.next(false);
      }
      else {
        this.loggedIn$.next(true);
      }

    });
  }

// how to refactor this code (same as in Personal Account component)
  onLogoutClick(): any {

    this.authService.currentPlayer$.next(null);
    localStorage.removeItem('Authorization');
    this.authService.loggedIn$.next(false);
    this.router.navigate(['/home']);
  }

  // toggleLogIn(): void {
  //   this.loggedIn = !this.loggedIn;
  // }

}
