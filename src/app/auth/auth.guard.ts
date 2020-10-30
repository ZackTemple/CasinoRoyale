import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      // const authorizationKey = localStorage.getItem('Authorization');
      // if ( typeof authorizationKey !== 'string' ) {
      //   this.router.navigate(['/sign-in']);
      // }

      let access: boolean;
      this.authService.signedIn$.subscribe(
        signedInQ => {
          access = signedInQ;
          if ( !signedInQ ) {
            console.log('AuthGuard');
            this.router.navigate(['/sign-in']);
          }
        }
      );

      return access;
      // return !!authorizationKey;
    }
}
