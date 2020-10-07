import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
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

      return !!authorizationKey;
    }
}
