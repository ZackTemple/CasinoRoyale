import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: any;
  let signedInMock: any;
  const cognitoUser = {
    Username: 'michael-scott',
    Pool: null,
    Storage: null
  } as unknown as CognitoUser;

  beforeEach(() => {
    signedInMock = new BehaviorSubject<boolean>(false);
    mockAuthService = {
      getAuthenticatedUser: jasmine.createSpy('getAuthenticatedUser'),
      signedIn$: signedInMock.asObservable(),
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {provide: AuthService , useValue: mockAuthService}
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate()', () => {
    it('should allow access if user is signed in by checking the signedIn subject from AuthService', async () => {
      signedInMock.next(true);

      await guard.canActivate().then(
        expectedBool => {
          expect(expectedBool).toBeTruthy();
        }
      );
    });

    it('if authService signedIn has not been set, call method in AuthService to verify user and allow access', async () => {
      mockAuthService.getAuthenticatedUser.and.returnValue(Promise.resolve(cognitoUser));

      await guard.canActivate().then(
        expectedBool => {
          expect(expectedBool).toBeTruthy();
        }
      );
    });

    it('should not allow user access if user is signed in by checking the signedIn subject from AuthService', async () => {
      signedInMock.next(false);
      const error = new Error();
      mockAuthService.getAuthenticatedUser.and.returnValue(throwError(error).toPromise());

      spyOn(guard.router, 'navigate').and.returnValue(Promise.resolve(true));

      await guard.canActivate().then(
        expectedBool => {
          expect(expectedBool).toBeFalsy();
        }
      );

      expect(guard.router.navigate).toHaveBeenCalledWith(['/sign-in']);
    });
  });
});
