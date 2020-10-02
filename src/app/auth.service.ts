import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, BehaviorSubject, Subject, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IPlayer } from './interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  databaseUrl = 'http://localhost:5000/api';
  currentPlayer$: BehaviorSubject<IPlayer> = new BehaviorSubject(null);
  loggedIn = false;
  allPlayers: IPlayer[];
  playersMap$: Subject<Map<string, IPlayer>> = new Subject();

  constructor(private httpClient: HttpClient) { }

  getPlayers(): Observable<any[]> {
    const playersPath = this.databaseUrl.concat('/players');
    return this.httpClient.get<any[]>(playersPath).pipe(
      tap(players => {
        // this.allPlayers = players;
        console.log({ players });
      })
      // catchError(this.handleError)
    );
  }

  logIn(username: string, password: string): boolean {
    // check database for the username and validate password
    // if login info is correct, set player Subject to the player information, and return true
    // if not correct, alert user and reset... do not tell them which info is incorrect. Just say 'incorrect username or password'
    // this.getPlayers().subscribe({
    //   next: players => {
        // if (Object.keys(players).includes(username)) {
        //   this.loggedIn = true;
        // }
        this.getPlayers();
    //   }
    // });
    return true; // this.loggedIn;
  }

  signUp(username: string, password: string): boolean {
    // (would hash here, but come back to it later)

    // two-step verify same password
    // post info to database
    return true; // if sign up is correct
  }

  private handleError(err: HttpErrorResponse) {
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
