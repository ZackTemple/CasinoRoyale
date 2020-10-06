import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPlayer } from '../interfaces/player';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  playersMap: Map<string, IPlayer> = new Map();

  constructor(
    private router: Router,
    private authService: AuthService) {
      this.authService.playersMap$.pipe(
        tap(data => console.log({ data }))
      ).subscribe({
        next: playersMap => {
            this.playersMap = playersMap;
        }
      });
    }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      const authorizationKey = localStorage.getItem('Authorization');

      const pageAccess =  this.authService.validUserQ(authorizationKey);
      if (!pageAccess) {
        this.router.navigate(['/home']);
      }
      return pageAccess;
    }
}
