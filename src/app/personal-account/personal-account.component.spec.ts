import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Player } from '../games/blackjack/objects/player';

import { PersonalAccountComponent } from './personal-account.component';

describe('PersonalAccountComponent', () => {
  let component: PersonalAccountComponent;
  let fixture: ComponentFixture<PersonalAccountComponent>;
  let mockAuthService;
  let playerObject: Player;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['getPlayer']);
    playerObject = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      id: 'id-here'
    });

    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      declarations: [ PersonalAccountComponent ],
      providers: [ {provide: AuthService , useValue: mockAuthService}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService.getPlayer.and.returnValue(of( playerObject ));
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
});



