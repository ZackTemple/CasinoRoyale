import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user';
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
  errorMessage: string;
  signedUpQ = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

  }

  async onClickEnter(): Promise<void> {
    await this.authService.signUp(this.user).then(
      ({user, userConfirmed, userSub}: {user: CognitoUser, userConfirmed: boolean, userSub: string}) => {
        if ( !!user ) {
          console.log(user);
          this.signedUpQ = true;
        }
      }
    ).catch(
      (error: Error) => {
        console.log(error.message);
        this.gatherErrorMessageForSignUp(error);
      }
    );
  }

  gatherErrorMessageForSignUp(error: any): void {
    switch (error.code) {

      case 'UsernameExistsException':
        this.errorMessage = 'User already exists. Please choose a new username, or sign in.';
       break;

      case 'InvalidPasswordException':
        const str = error.message;
        this.errorMessage = str.substring(str.indexOf(':') + 1);
        break;

      case 'InvalidParameterException':
        this.errorMessage = error.message;
    }
  }
}
