import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../User';
import { CognitoUser } from 'amazon-cognito-identity-js';

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
  signedUpQ = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

  }

  onClickEnter(): void {
    this.authService.signUp(this.user).then(
      ({user, userConfirmed, userSub}: {user: CognitoUser, userConfirmed: boolean, userSub: string}) => {
        if ( !!user ) {
          console.log(user);
          this.signedUpQ = true;
        }
      }
    ).catch(
      (error: Error) => {
        console.log(error.message);
      }
    );
  }
}
