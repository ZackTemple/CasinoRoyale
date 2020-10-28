import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, BehaviorSubject} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IPlayer } from '../interfaces/player';
import { MatDialog } from '@angular/material/dialog';
import { FailedSignInDialogComponent } from './dialog/failed-sign-in-dialog.component';
import * as _ from 'lodash';
import { Auth } from 'aws-amplify';
import { User } from './user';
import { CognitoUser } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  databaseUrl = 'http://localhost:5000/api/players';
  signedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  allPlayers: IPlayer[];
  currentPlayer: IPlayer;


  // Constructor gets all Players
  constructor(private httpClient: HttpClient, private dialog: MatDialog ) {

    this.getPlayers().subscribe();

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


  // Fetches player data, builds map, and returns that map
  getPlayers(): Observable<IPlayer[]> {
    return this.httpClient.get(this.databaseUrl).pipe(
      map(
        (players: IPlayer[]) => {
          this.allPlayers = players;
          return players;
        }
      )
    );
  }


  // Called inside deposit-money and blackjack to update player info to the API
  // Depends on lodash
  updatePlayer(updatedPlayer: IPlayer): Observable<any> {
    const playerUrl = this.databaseUrl.concat(`/${updatedPlayer.username}`);
    const playerWithoutID = _.omit(updatedPlayer, 'username');

    return this.httpClient.put(playerUrl, playerWithoutID).pipe(
      tap(message => {
        console.log(message);
      })
    );
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
        console.log( {user} );
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
        await this.getExistingPlayerInfo(user);
        this.signedIn$.next(true);
    } catch (error) {
        console.log('error signing in', error);
        this.dialog.open(FailedSignInDialogComponent);
        throw error;
    }
  }

  private async getExistingPlayerInfo(user: CognitoUser): Promise<void> {
    const username = user['username'];
    const playerUrl = this.databaseUrl.concat(`/${username}`);

    this.httpClient.get(playerUrl).toPromise().then(
      (player: any) => {
        this.currentPlayer = player;
        localStorage.setItem('Authorization', JSON.stringify(player));
      }
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
}
