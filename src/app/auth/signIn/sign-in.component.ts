import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
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
    this.authService.signedIn$.subscribe({
      next: signInQ => {
        if (signInQ) {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  onClickSignIn(): void {
    // call returns true if user could be logged in
    this.authService.signIn(this.username, this.password);
  }
}
