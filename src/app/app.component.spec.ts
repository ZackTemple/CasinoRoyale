import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let mockAuthService: any;
  let signedInMock: any;

  beforeEach(async () => {
    signedInMock = new BehaviorSubject<boolean>(true);
    mockAuthService = {
      signedIn$: signedInMock.asObservable(),
      signOut: jasmine.createSpy('signOut')
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule,
        SharedModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: AuthService, useValue: mockAuthService}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set the signedIn attribute on ngOnInit', () => {
    signedInMock.next(false);

    component.ngOnInit();

    expect(component.signedIn).toBeFalsy();
  });

  it(`should have as title 'CasinoRoyale'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Casino Royale');
  });

  describe('onClickSignOut', () => {
    it('should route the user home, sign them out, and remove the authorization token from aws cognito', () => {
      const localStorageSpy = spyOn(localStorage, 'removeItem');
      const promiseThatResolvesToValueGiven = Promise.resolve(true);
      spyOn(component.router, 'navigate').and.returnValue(promiseThatResolvesToValueGiven);
      component.onSignOutClick();

      expect(mockAuthService.signOut).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home']);
      expect(localStorageSpy).toHaveBeenCalledWith('Authorization');
    });
  });
});
