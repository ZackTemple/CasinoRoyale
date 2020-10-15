import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IPlayer } from '../interfaces/player';
import { MatDialog } from '@angular/material/dialog';
import { FailedLoginDialogComponent } from './dialog/failed-login-dialog.component';
import * as _ from 'lodash';
import { playersDB } from '../../api/players';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  // Properties used for Http calls
  databaseUrl = 'api/players.json';


  // Properties and subjects used to track webiste information
  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(this.loggedInQ());
  playersMap$: Subject<Map<string, IPlayer>> = new Subject();
  playersMap: Map<string, IPlayer>;


  // Constructor initializes playersMap and playersMap$ once it constructs
  constructor(private httpClient: HttpClient, private dialog: MatDialog ) {

    this.getPlayers().subscribe(data => {
      this.playersMap = data;
      this.playersMap$.next(data);
    });
  }


  // Fetches player data, builds map, and returns that map
  getPlayers(): any { // Observable<Map<string, IPlayer>> {
    const playersMap: Map<string, IPlayer> = new Map();

        playersDB.forEach(player => {
          playersMap.set(player.username, player);
        });
        return of(playersMap);

    // return this.httpClient.get<Map<string, IPlayer>>(this.databaseUrl).pipe(
    //   map(players => {
    //     const playersMap: Map<string, IPlayer> = new Map();

    //     players.forEach(player => {
    //       playersMap.set(player.username, player);
    //     });
    //     return playersMap;
    //   }),
    //   catchError(this.handleError)
    // );
  }


  // Called inside deposit-money and blackjack to update player info to the API
  // Depends on lodash
  updatePlayer(updatedPlayer: IPlayer): Observable<any> {
    const playerUrl = this.databaseUrl.concat(`/${updatedPlayer._id}`);
    const playerWithoutID = _.omit(updatedPlayer, '_id');

    return this.httpClient.put(playerUrl, playerWithoutID).pipe(
      tap(message => {
        console.log(message);
      })
    );
  }


  // Allows the user to login. Sets the loggedIn$ subject to true and creates auth key if successful
  logIn(username: string, password: string): void {

    const userInfo = this.playersMap.get(username);

    if (userInfo === undefined || userInfo.password !== password) {
      this.dialog.open(FailedLoginDialogComponent);
    }
    else if (userInfo.password === password) {
      this.loggedIn$.next(true);
      localStorage.setItem('Authorization', JSON.stringify(userInfo));
    }
    else {
      this.dialog.open(FailedLoginDialogComponent);
    }
  }

  // Used for the default value for loggedIn$
  // Returns true or false depending on whether there is an authorization key
  loggedInQ(): boolean {
    return typeof localStorage.getItem('Authorization') === 'string';
  }


  // A sign up method that posts to the API with new player info
  signUp(username: string, password: string): boolean {

    // two-step verify same password
    // post info to database
    return true; // if sign up is correct
  }


  // Handles errors for API calls
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
