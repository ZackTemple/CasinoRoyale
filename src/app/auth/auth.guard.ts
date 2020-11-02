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
      if (this.access) {
        return of(true).toPromise();
      }

      return this.currentAuthenticatedUserExists().then(
        currentUserExists => {
          this.access = currentUserExists;
          if (!this.access) { this.router.navigate(['/sign-in']); }
          return this.access;
        }
      );
    }

    // Called when sign in is not true and need to check on refresh or new session if their is an authenticated user
    async currentAuthenticatedUserExists(): Promise<boolean> {
      return await Auth.currentAuthenticatedUser({bypassCache: false}).then(
          (user: CognitoUser) => {
            if (user !== null) {
              this.authService.playerUsername = user['username'];
              this.authService.signedIn$.next(true);
              return true;
            }
            else {
              return false;
            }
          }
        )
          .catch(err => {
            console.log(err);
            return false;
          });
    }
}
