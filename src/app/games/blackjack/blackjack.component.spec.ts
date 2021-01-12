import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { BlackjackComponent } from './blackjack.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from './objects/player';
import { Table } from './objects/table';
import { Dealer } from './objects/dealer';
import { BlackjackService } from './blackjack.service';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';


describe('BlackjackComponent', () => {
  let component: BlackjackComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockGameService: jasmine.SpyObj<BlackjackService>;
  let mockDialog: any;
  let consoleSpy: jasmine.Spy;
  let playerObject: Player;
  let tableObject: Table;
  let httpError: HttpTrackerError;

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
    tableObject = new Table();
    tableObject.player = playerObject;
    tableObject.dealer = new Dealer();
    httpError = new HttpTrackerError();

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [ BlackjackComponent ],
      providers: [
        {provide: AuthService , useValue: mockAuthService},
        {provide: BlackjackService, useValue: mockGameService},
        {provide: MatDialog , useValue: MockComponent(MatDialog)},
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    mockGameService = jasmine.createSpyObj(['startGame', 'dealCardToPlayer', 'finishGame']);
    consoleSpy = spyOn(console, 'log').and.callThrough();
    mockDialog = MockModule(MatDialogModule);
    component = new BlackjackComponent(mockAuthService, mockGameService, mockDialog);

    mockAuthService.getPlayer.and.returnValue(of(component.player));
    mockAuthService.updatePlayer.and.returnValue(of(component.player));
    component.player = playerObject;
    component.table = tableObject;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickPlaceBet()', () => {
    beforeEach(() => {
      component.gameInProgress = false;
    });
    it('makes an http call to start the game from gameService sets comonent attributes when the call returns with a value', () => {
      mockGameService.startGame.and.returnValue(of(tableObject));

      component.clickPlaceBet();

      expect(mockGameService.startGame).toHaveBeenCalled();
      expect(component.gameInProgress).toBeTruthy();
    });

    it('does not start a game if the http call returns an error', () => {
      mockGameService.startGame.and.returnValue(throwError(httpError));

      component.clickPlaceBet();

      expect(mockGameService.startGame).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(httpError.message);
      expect(component.gameInProgress).toBeFalsy();
    });
  });

  describe('clickHit()', () => {
    it('makes an http call to add a card to the deck of the player and acts accordingly', () => {
      mockGameService.dealCardToPlayer.and.returnValue(of(tableObject));

      component.clickHit();

      expect(mockGameService.dealCardToPlayer).toHaveBeenCalled();
      expect(component.player).toEqual(tableObject.player);
      expect(component.table).toEqual(tableObject);
    });

    it('does nothing if http call returns an error', () => {
      mockGameService.startGame.and.returnValue(throwError(httpError));

      component.clickPlaceBet();

      expect(mockGameService.startGame).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(httpError.message);
    });
  });

  describe('clickStay()', () => {
    it('makes an http call to add a card to the deck of the player and acts accordingly', () => {
      mockGameService.finishGame.and.returnValue(of(tableObject));

      component.clickStay();

      expect(mockGameService.finishGame).toHaveBeenCalled();
    });

    it('does nothing if http call returns an error', () => {
      mockGameService.finishGame.and.returnValue(throwError(httpError));

      component.clickStay();

      expect(mockGameService.finishGame).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(httpError.message);
    });
  });

  describe('updatePlayer()', () => {
    it('makes an http call to update the player', () => {
      component.updatePlayer();
      expect(mockAuthService.updatePlayer).toHaveBeenCalled();
    });
  });

  describe('getImage()', () => {
    it('takes a card and returns a string url for the location of the image', () => {
      component.updatePlayer();
      expect(mockAuthService.updatePlayer).toHaveBeenCalled();
    });
  });
});
