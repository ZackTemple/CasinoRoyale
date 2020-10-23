import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../User';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  input: string;
  hide = true;
  user = new User();
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  onClickEnter(): void {
    // call returns true if user could be logged in
    this.authService.signUp(this.user).then(
      signedUpQ => {
        if (signedUpQ) {
          this.router.navigate(['/home']);
        }
      }
    );
  }
}
