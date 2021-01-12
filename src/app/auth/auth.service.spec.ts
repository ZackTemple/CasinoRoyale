import { TestBed } from '@angular/core/testing';
import { Auth } from 'aws-amplify';
import { of, throwError } from 'rxjs';
import { Player } from '../games/blackjack/objects/player';
import { ErrorService } from '../shared/error.service';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
  let authService: AuthService;
  let httpClientSpy: any;
  let playerObject: Player;
  let userProfile: any;
  let matDialogSpy: any;
  const errorService = new ErrorService();

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    playerObject = new Player({
      username: 'MichaelScott',
      password: 'password',
      active: false,
      currentMoney: 20,
      totalEarned: 20,
      totalLost: 10000
    });

    userProfile = {
      username: playerObject.username,
      email: 'michaelScott@yahoo.com',
      password: 'password1234'
    };

    spyOn(Auth, 'currentAuthenticatedUser').and.returnValue(Promise.resolve(userProfile));
    spyOn(Auth, 'signOut').and.returnValue(Promise.resolve());
    spyOn(Auth, 'resendSignUp').and.returnValue(Promise.resolve());

    const returnedFromSignUp = {user: playerObject, userConfirmed: false, userSub: 'foobar'} as unknown as ISignUpResult;
    spyOn(Auth, 'signUp').and.returnValue(Promise.resolve(returnedFromSignUp));

    authService = new AuthService(httpClientSpy as any, matDialogSpy as any, errorService);
  });

  // now our test begins
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthService],
    }).compileComponents();
  });

  it('should make Authorization call to get authenticated user', () => {
    expect(authService.playerUsername).toBe(userProfile['username']);
  });

  describe('signUp()', () => {
    it('should post a new player to the database if no errors are thrown', async () => {
      httpClientSpy.post.and.returnValue(of(playerObject));

      await authService.signUp(userProfile);

      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('signIn()', () => {
    it('should call aws auth method to sing the player in', async () => {
      authService.signedIn$.next(false);
      spyOn(Auth, 'signIn').and.returnValue(Promise.resolve(userProfile));

      await authService.signIn(playerObject.username, userProfile['password']);

      expect(Auth.signIn).toHaveBeenCalled();
      expect(authService.signedIn$.value).toBeTruthy();
    });

    it('should not sign the player in if an error is thrown and a mat dialog box alerts the user', async () => {
      const httpError = new HttpErrorResponse({error: 404});
      authService.signedIn$.next(false);
      spyOn(Auth, 'signIn').and.returnValue(throwError(httpError).toPromise());
      matDialogSpy.open.and.returnValue(true);
      let error: HttpErrorResponse;

      try {
        await authService.signIn(playerObject.username, userProfile['password']);
      } catch (e) {
        error = e;
      }

      expect(Auth.signIn).toHaveBeenCalled();
      expect(authService.signedIn$.value).toBeFalsy();
      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(error.error).toBe(httpError.error);
    });
  });

  describe('updatePlayer()', () => {
    it('should make http call to the API to post a new player', () => {
      httpClientSpy.post.and.returnValue(of(playerObject));

      authService.postNewPlayer(playerObject.username);

      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPlayer()', () => {
    it('gets the current player information from the api', () => {
      httpClientSpy.get.and.returnValue(of(playerObject));

      authService.getPlayer(playerObject.username);

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/api/players/${playerObject.username}`);
    });
  });

  describe('updatePlayer()', () => {
    it('should PUT to the API with new plyaer data', () => {
      httpClientSpy.put.and.returnValue(of(playerObject));

      authService.updatePlayer(playerObject);

      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('signOut()', () => {
    it('should sign out the player', async () => {
      authService.signedIn$.next(true);

      await authService.signOut();

      expect(Auth.signOut).toHaveBeenCalledTimes(1);
      expect(authService.signedIn$.value).toBeFalsy();
    });
  });

  describe('resendConfirmationCode()', () => {
    it('should call auth method to resend verification email to user', async () => {
      await authService.resendConfirmationCode(playerObject.username);
      expect(Auth.resendSignUp).toHaveBeenCalledTimes(1);
    });
  });
});
