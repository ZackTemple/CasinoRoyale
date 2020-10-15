import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  input: string;
  hide = true;
  username: string;
  password: string;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe({
      next: logInQ => {
        if (logInQ) {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  onClickEnter(): void {
    // call returns true if user could be logged in
    this.authService.logIn(this.username, this.password);
  }
}
