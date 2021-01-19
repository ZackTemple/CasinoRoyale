import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Player } from 'src/app/games/blackjack/objects/player';
import { AuthService } from '../auth.service';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let mockAuthService;
  let signedInMock: any;
  const playerObject = new Player({
    username: 'MichaelScott',
    password: 'password',
    active: false,
    currentMoney: 20,
    totalEarned: 20,
    totalLost: 10000
  });


  beforeEach(async () => {
    signedInMock = new BehaviorSubject<boolean>(false);
    mockAuthService = {
      getPlayer: jasmine.createSpy('getPlayer'),
      signedIn$: signedInMock.asObservable(),
      signIn: jasmine.createSpy('signIn')
    };
    mockAuthService.getPlayer.and.returnValue(of(playerObject));
    mockAuthService.signIn.and.returnValue(of(true));
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [ SignInComponent ],
      providers: [{provide: AuthService, useValue: mockAuthService}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClickSignIn()', () => {
    it('should call auth service to sign player in', () => {
      component.username = 'michael-scott';
      component.password = 'password1234';

      component.onClickSignIn();

      expect(mockAuthService.signIn).toHaveBeenCalledTimes(1);
    });
  });
});
