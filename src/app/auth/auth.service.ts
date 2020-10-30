import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IPlayer } from '../interfaces/player';
import { MatDialog } from '@angular/material/dialog';
import { FailedSignInDialogComponent } from './dialog/failed-sign-in-dialog.component';
import * as _ from 'lodash';
import { Auth } from 'aws-amplify';
import { User } from './user';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { PlayerTrackerError } from './player-tracker-error';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  databaseUrl = 'http://localhost:5000/api/players';
  signedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  allPlayers: IPlayer[];
  currentPlayer: IPlayer;

  constructor(private httpClient: HttpClient, private dialog: MatDialog ) {
    Auth.currentAuthenticatedUser({bypassCache: false}).then(
      user => {
        console.log(user);
        if (user !== null) {
          this.getExistingPlayerInfo(user);
          this.signedIn$.next(true);
        }
      }
    )
      .catch(err => console.log(err));
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

        this.postNewPlayer(user).subscribe();
        console.log( {user} );
        return {user, userConfirmed, userSub};
    } catch (error) {
        console.log('error signing up:', error);
        throw error;
    }
  }

  postNewPlayer(user: CognitoUser): Observable<IPlayer | PlayerTrackerError> {
    const playerUsername = user['username'];
    return this.httpClient.post<IPlayer>(this.databaseUrl, {username: playerUsername}).pipe(
      catchError(err => this.handleHttpError(err))
    );
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

  // private async getExistingPlayerInfo(user: CognitoUser): Promise<void> {
  //   const username = user['username'];
  //   const playerUrl = this.databaseUrl.concat(`/${username}`);

  //   this.httpClient.get(playerUrl).toPromise().then(
  //     (player: any) => {
  //       this.currentPlayer = player;
  //       localStorage.setItem('Authorization', JSON.stringify(player));
  //     }
  //   );
  // }

  // Sets local storage after calling getPlayer
  private getExistingPlayerInfo(user: CognitoUser): void {
    const username = user['username'];

    this.getPlayer(username).subscribe(
      (player: IPlayer) => {
        localStorage.setItem('Authorization', JSON.stringify(player));
        this.setSignIn();
      },
      (err: PlayerTrackerError) => console.log(err)
    );
  }

  setSignIn(): void {
    this.signedIn$.next(true);
  }

  // Gets the player from the API and sets it to the current player
  getPlayer(username: string): Observable<IPlayer | PlayerTrackerError> {
    const playerUrl = this.databaseUrl.concat(`/${username}`);

    return this.httpClient.get(playerUrl).pipe(
      tap(
        (player: IPlayer) => {
          this.currentPlayer = player;
        }
      ),
      catchError(
        (err: HttpErrorResponse) => this.handleHttpError(err)
      )
    );
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

  // Called inside deposit-money and blackjack to update player info to the API
  // Depends on lodash
  updatePlayer(updatedPlayer: IPlayer): Observable<IPlayer | PlayerTrackerError> {
    const playerUrl = this.databaseUrl.concat(`/${updatedPlayer.username}`);
    const playerWithoutID = _.omit(updatedPlayer, 'username');

    return this.httpClient.put(playerUrl, playerWithoutID).pipe(
      tap(
        (player: IPlayer) => this.currentPlayer = player
      ),
      catchError(
        err => this.handleHttpError(err)
      )
    );
  }

  handleHttpError(err: HttpErrorResponse): Observable<PlayerTrackerError> {
    const playerRetrievalError = new PlayerTrackerError();
    playerRetrievalError.errorCode = err.status;
    playerRetrievalError.message = 'Error retrieving the data.';
    return throwError(playerRetrievalError);
  }
}
