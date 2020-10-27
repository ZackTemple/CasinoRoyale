import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IPlayer } from '../interfaces/player';
import { MatDialog } from '@angular/material/dialog';
import { FailedSignInDialogComponent } from './dialog/failed-sign-in-dialog.component';
import * as _ from 'lodash';
import { playersDB } from '../../api/players';
import { Auth } from 'aws-amplify';
import { User } from './User';
import { Player } from '../games/blackjack/objects/player';
import { CognitoUser } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  // Properties used for Http calls
  databaseUrl = 'http://localhost:5000/api/players';


  // Properties and subjects used to track webiste information
  signedIn$: BehaviorSubject<boolean> = new BehaviorSubject(this.loggedInQ());
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
    return this.httpClient.get(this.databaseUrl).pipe(
      map(
        (players: IPlayer[]) => {
          const playersMap: Map<string, IPlayer> = new Map();

          players.forEach(player => {
            playersMap.set(player.username, player);
          });

          return playersMap;
        }
      ),
      tap(
        players => console.log( {players} )
      )
    );
  }


  // Called inside deposit-money and blackjack to update player info to the API
  // Depends on lodash
  updatePlayer(updatedPlayer: IPlayer): Observable<any> {
    const playerUrl = this.databaseUrl.concat(`/${updatedPlayer.id}`);
    const playerWithoutID = _.omit(updatedPlayer, 'id');

    return this.httpClient.put(playerUrl, playerWithoutID).pipe(
      tap(message => {
        console.log(message);
      })
    );
  }


  // // Allows the user to sign in. Sets the loggedIn$ subject to true and creates auth key if successful
  // logIn(username: string, password: string): void {

  //   const userInfo = this.playersMap.get(username);

  //   if (userInfo === undefined || userInfo.password !== password) {
  //     this.dialog.open(FailedSignInDialogComponent);
  //   }
  //   else if (userInfo.password === password) {
  //     this.signedIn$.next(true);
  //     localStorage.setItem('Authorization', JSON.stringify(userInfo));
  //   }
  //   else {
  //     this.dialog.open(FailedSignInDialogComponent);
  //   }
  // }

  // Used for the default value for loggedIn$
  // Returns true or false depending on whether there is an authorization key
  loggedInQ(): boolean {
    return typeof localStorage.getItem('Authorization') === 'string';
  }


  // A sign up method that posts to the API with new player info
  async signUp(newUser: User): Promise<any> {
    const username = newUser.username;
    const password = newUser.password;
    const email = newUser.email;

    try {
        const { user, userConfirmed, userSub } = await Auth.signUp({
            username,
            password,
            attributes: {
              email
            }
        });

        this.postNewPlayer(user);
        return {user, userConfirmed, userSub};
    } catch (error) {
        console.log('error signing up:', error);
        throw error;
    }
  }

  postNewPlayer(user: CognitoUser): void {
    const playerUsername = user['username'];
    this.httpClient.post(this.databaseUrl, {username: playerUsername}).subscribe();
  }


  async signIn(username: string, password: string): Promise<void> {
    try {
        const user = await Auth.signIn(username, password);
        this.getExistingPlayerInfo(user);
        this.signedIn$.next(true);
    } catch (error) {
        console.log('error signing in', error);
        this.dialog.open(FailedSignInDialogComponent);
        throw error;
    }
  }

  private getExistingPlayerInfo(user): void {
    const username = user['username'];
    const playerUrl = this.databaseUrl.concat(`/${username}`);

    this.player$ = this.httpClient.get(playerUrl).subscribe();
  }


  async signOut(): Promise<void> {
      try {
          await Auth.signOut({ global: true });
          this.signedIn$.next(false);
      } catch (error) {
          console.log('error signing out: ', error);
      }
  }


  async resendConfirmationCode(username: string): Promise<void> {
    try {
        await Auth.resendSignUp(username);
        console.log('code resent successfully');
    } catch (err) {
        console.log('error resending code: ', err);
    }
  }
}
