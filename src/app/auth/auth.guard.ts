import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { IPlayer } from '../interfaces/player';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      const authorizationKey = localStorage.getItem('Authorization');
      if ( typeof authorizationKey !== 'string' ) {
        this.router.navigate(['/login']);
      }

      return !!authorizationKey;
    }
}
