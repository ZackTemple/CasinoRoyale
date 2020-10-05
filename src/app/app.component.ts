import { Component, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService) {}

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

  onLogoutClick(): any {

    this.authService.currentPlayer$.next(null);
    localStorage.removeItem('Authorization');
    this.loggedIn$.next(false);
  }

  // toggleLogIn(): void {
  //   this.loggedIn = !this.loggedIn;
  // }

}
