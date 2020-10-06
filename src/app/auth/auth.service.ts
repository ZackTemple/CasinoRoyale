import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IPlayer } from '../interfaces/player';
import { MatDialog } from '@angular/material/dialog';
import { FailedLoginDialogComponent } from './dialog/failed-login-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  databaseUrl = 'http://localhost:4200/api';
  currentPlayer$: BehaviorSubject<IPlayer> = new BehaviorSubject(null);
  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  allPlayers: IPlayer[];
  playersMap$: Subject<Map<string, IPlayer>> = new Subject();
  playersMap: Map<string, IPlayer>;

  constructor(private httpClient: HttpClient, private dialog: MatDialog ) {
    this.getPlayers().subscribe(data => this.playersMap = data);
  }

  // initializePlayersMap(): void {
  //   this.playersMap$.subscribe({
  //     next: playersMap => {
  //         this.playersMap = playersMap;
  //     }
  //   });
  // }

  // Fetches player data, builds map, and returns that map
  getPlayers(): Observable<Map<string, IPlayer>> {
    const playersPath = this.databaseUrl.concat('/players');
    return this.httpClient.get<Map<string, IPlayer>>(playersPath).pipe(
      map(players => {
        const playersMap: Map<string, IPlayer> = new Map();

        players.forEach(player => {
          playersMap.set(player.username, player);
        });
        return playersMap;
      }),
      catchError(this.handleError)
    );
  }

  logIn(username: string, password: string): void {

    const userInfo = this.playersMap.get(username);
    console.log(userInfo);

    if (userInfo === undefined || userInfo.password !== password) {
      console.log('user not available or password incorrect');
      this.dialog.open(FailedLoginDialogComponent);
    }
    else if (userInfo.password === password) {
      this.loggedIn$.next(true);
      this.currentPlayer$.next(userInfo);
      console.log('login successful!');
      localStorage.setItem('Authorization', userInfo.username);
    }
    else {
      console.log('login failed :(');
      this.dialog.open(FailedLoginDialogComponent);
    }
  }

  signUp(username: string, password: string): boolean {
    // (would hash here, but come back to it later)

    // two-step verify same password
    // post info to database
    return true; // if sign up is correct
  }


  validUserQ(authorizationKey: string): boolean {
    let validUser: boolean;
    const currentPlayer = this.playersMap.get(authorizationKey);

    if (currentPlayer) {
      validUser = true;
      this.currentPlayer$.next(currentPlayer);
    }
    else{
      validUser = false;
    }

    return validUser;
  }


  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client side error occurred
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else {
      // The backend returned an unsuccessful response code
      // The response body may contain clues as to what's wrong
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
