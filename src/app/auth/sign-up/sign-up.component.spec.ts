import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { CognitoUser } from 'amazon-cognito-identity-js';

import { SignUpComponent } from './sign-up.component';
import { User } from '../user';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  const returnedFromSignUp = {
    user: {username: 'michael-scott'} as unknown as CognitoUser,
    userConfirmed: true,
    userSub: 'foobar'
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['signUp']);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatDialogModule ],
      declarations: [ SignUpComponent ],
      providers: [ {provide: AuthService , useValue: mockAuthService}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClickEnter()', () => {
    beforeEach(() => {
      component.user = new User();
      component.user.email = 'myemail@yahoo.com';
      component.user.username = 'michael-scott';
      component.user.password = 'password1234';
    });

    it('makes call to auth service to sign the user up', async () => {
      mockAuthService.signUp.and.returnValue(of(returnedFromSignUp).toPromise());

      await component.onClickEnter();

      expect(component.signedUpQ).toBeTruthy();
      expect(mockAuthService.signUp).toHaveBeenCalledWith(component.user);
    });

    it('error handles if sign up fails', async () => {
      mockAuthService.signUp.and.returnValue(throwError(new Error()).toPromise());
      const errorHandlingSpy = spyOn(component, 'gatherErrorMessageForSignUp').and.callThrough();

      await component.onClickEnter();

      expect(component.signedUpQ).toBeFalsy();
      expect(mockAuthService.signUp).toHaveBeenCalledWith(component.user);
      expect(errorHandlingSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('gatherErrorMessageForSignUp()', () => {
    it('should prompt user if username already exists', () => {
      const error = {code: 'UsernameExistsException'};
      spyOn(console, 'log').and.callThrough();

      component.gatherErrorMessageForSignUp(error);

      expect(component.errorMessage).toContain('User already exists.');
    });
    it('should prompt user if password is invalid', () => {
      const error = {code: 'InvalidPasswordException', message: 'Password should contain at least 1 number.'};

      component.gatherErrorMessageForSignUp(error);

      expect(component.errorMessage).toContain(error.message);
    });
    it('should prompt user if InvalidParameterException is hit', () => {
      const error = {code: 'InvalidParameterException', message: 'Invalid parameter'};

      component.gatherErrorMessageForSignUp(error);

      expect(component.errorMessage).toContain(error.message);
    });
  });
});
