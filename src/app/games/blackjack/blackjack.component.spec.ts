import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BlackjackComponent } from './blackjack.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from './objects/player';


describe('BlackjackComponent', () => {
  let component: BlackjackComponent;
  let mockAuthService;
  let mockGameService;
  let mockDialog;
  let playerObject;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    mockDialog = MockComponent(MatDialog);
    playerObject = new Player({
      username: 'MichaelScott',
      password: 'password',
      active: false,
      currentMoney: 20,
      totalEarned: 20,
      totalLost: 10000
    });

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [ BlackjackComponent ],
      providers: [
        {provide: AuthService , useValue: mockAuthService},
        {provide: MatDialog , useValue: MockComponent(MatDialog)},
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    mockGameService = jasmine.createSpyObj(['startGame', 'dealCardToPlayer', 'finishGame']);
    mockDialog = MockModule(MatDialogModule);
    component = new BlackjackComponent(mockAuthService, mockGameService, mockDialog);

    mockAuthService.getPlayer.and.returnValue(of(component.player));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
