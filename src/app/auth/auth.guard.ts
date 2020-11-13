import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  access: boolean;

  constructor(
    private router: Router,
    private authService: AuthService) {
      this.authService.signedIn$.subscribe(signedInQ => this.access = signedInQ);
    }

  async canActivate(): Promise<boolean> {

      // Passes when the user has already been authenticated (which sets this.authService.signedIn to true)
      if (this.access) {
        return of(true).toPromise();
      }

      // is user hasn't been authenticated (during refresh or new session), check to see if there is an authenticated user
      return this.authService.getAuthenticatedUser().then(
        (currentUser: CognitoUser) => {
          if (currentUser) {
            return true;
          }
        }
      ).catch(
        error => {
          console.log('Failed to retrieve authenticated user.');
          this.router.navigate(['/sign-in']);
          return false;
        }
      );
    }
}
