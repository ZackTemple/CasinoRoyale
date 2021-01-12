import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Player } from '../games/blackjack/objects/player';
import { SharedModule } from '../shared/shared.module';

import { PersonalAccountComponent } from './personal-account.component';


describe('PersonalAccountComponent', () => {
  let component: PersonalAccountComponent;
  let fixture: ComponentFixture<PersonalAccountComponent>;
  let mockAuthService: any;
  let playerObject: Player;
  let signedInMock: any;

  beforeEach(async () => {
    signedInMock = new BehaviorSubject<boolean>(true);
    mockAuthService = {
      signedIn$: signedInMock,
      signOut: jasmine.createSpy('signOut'),
      getPlayer: jasmine.createSpy('getPlayer')
    };
    playerObject = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100
    });

    await TestBed.configureTestingModule({
      imports: [ SharedModule, RouterTestingModule ],
      declarations: [ PersonalAccountComponent ],
      providers: [ {provide: AuthService , useValue: mockAuthService}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService.getPlayer.and.returnValue(of( playerObject ));
    mockAuthService.signOut.and.returnValue(Promise.resolve());
    fixture = TestBed.createComponent(PersonalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the component player', () => {
    expect(component.player.username).toBe('foo');
  });

  describe('onLogoutClick()', () => {
    it('should sign player out and route player to home', () => {
      const promiseThatResolvesToValueGiven = Promise.resolve(true);
      spyOn(component.router, 'navigate').and.returnValue(promiseThatResolvesToValueGiven);

      component.onLogoutClick();

      expect(mockAuthService.signOut).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home']);
    });
  });
});



