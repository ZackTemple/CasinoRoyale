import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IPlayer } from '../interfaces/player';
import { MatDialog } from '@angular/material/dialog';
import { FailedSignInDialogComponent } from './dialog/failed-sign-in-dialog.component';
import * as _ from 'lodash';
import { Auth } from 'aws-amplify';
import { User } from './user';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { HttpTrackerError } from '../shared/http-tracker-error';
import { ErrorService } from '../shared/error.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  databaseUrl = `${environment.apiBaseUrl}/api/players`;
  signedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  playerUsername: string;

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private errorService: ErrorService
    ) {
    this.getAuthenticatedUser().then().catch(
      error => console.log(error)
    );
  }

  async getAuthenticatedUser(): Promise<any> {
    let user: CognitoUser;

    try{
      user = await Auth.currentAuthenticatedUser({bypassCache: false});
      this.playerUsername = user['username'];
      this.signedIn$.next(true);
      return user;
    } catch (error) {
      throw error;
    }
  }

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
        this.postNewPlayer(user['username']).subscribe();
        return {user, userConfirmed, userSub};
    } catch (error) {
        console.log('error signing up: ', error);
        throw error;
    }
  }

  postNewPlayer(playerUsername: string): Observable<IPlayer | HttpTrackerError> {
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: '*/*',
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.httpClient.post<IPlayer>(this.databaseUrl, JSON.stringify(playerUsername), requestOptions).pipe(
      catchError(err => this.errorService.handleHttpError(err))
    );
  }

  async signIn(username: string, password: string): Promise<void> {
    try {
        const user = await Auth.signIn(username, password);
        this.playerUsername = user['username'];
        this.signedIn$.next(true);
    } catch (error) {
        console.log('error signing in', error);
        this.dialog.open(FailedSignInDialogComponent);
        throw error;
    }
  }

  // Gets the player from the API and sets it to the current player
  getPlayer(username: string): Observable<IPlayer | HttpTrackerError> {
    const playerUrl = this.databaseUrl.concat(`/${username}`);

    return this.httpClient.get<IPlayer>(playerUrl).pipe(
      catchError(
        (err: HttpErrorResponse) => this.errorService.handleHttpError(err)
      )
    );
  }

  updatePlayer(updatedPlayer: IPlayer): Observable<IPlayer | HttpTrackerError> {
    const playerModel = this.getPlayerModel(updatedPlayer);
    const playerUrl = this.databaseUrl.concat(`/${playerModel.username}`);

    return this.httpClient.put(playerUrl, playerModel).pipe(
      tap(
        (player: IPlayer) => {}
      ),
      catchError(
        err => this.errorService.handleHttpError(err)
      )
    );
  }

  private getPlayerModel(player: IPlayer): IPlayer {
    const clone = _.cloneDeep(player);
    const validKeys = ['username', 'currentMoney', 'totalEarned', 'totalLost', 'active'];

    Object.keys(clone).forEach((key) => validKeys.includes(key) || delete clone[key]);
    return clone;
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
