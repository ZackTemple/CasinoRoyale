import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { BlackjackComponent } from './blackjack.component';
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
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let consoleSpy: jasmine.Spy;
  let playerObject: Player;
  let tableObject: Table;
  let httpError: HttpTrackerError;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
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
        {provide: MatDialog , useValue: matDialogSpy},
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    mockGameService = jasmine.createSpyObj(['startGame', 'dealCardToPlayer', 'finishGame']);
    consoleSpy = spyOn(console, 'log').and.callThrough();
    component = new BlackjackComponent(mockAuthService, mockGameService, matDialogSpy);

    mockAuthService.getPlayer.and.returnValue(of(playerObject));
    mockAuthService.updatePlayer.and.returnValue(of(playerObject));
    component.player = playerObject;
    component.table = tableObject;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should get the player and set his/her current bet to 0', () => {
      component.player = null;

      component.ngOnInit();

      expect(component.player.username).toBe(playerObject.username);
    });
  });

  describe('increasePlayerBet(num)', () => {
    it('should increase the current player bet by the given input', () => {
      component.player.currentBet = 102;

      component.increasePlayerBet(5);

      expect(component.player.currentBet).toBe(107);
    });
  });

  describe('resetPlayerBet()', () => {
    it('should set the players current bet to zero', () => {
      component.player.currentBet = 102;

      component.resetPlayerBet();

      expect(component.player.currentBet).toBe(0);
    });
  });

  describe('clickPlayAgain()', () => {
    it('should set gameInProgress attribute to false', () => {
      component.gameInProgress = true;

      component.clickPlayAgain();

      expect(component.gameInProgress).toBeFalsy();
    });
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

  describe('showHelperCard()', () => {
    it('should open a helper card for the user', () => {
      matDialogSpy.open.and.callThrough();

      component.showHelperCard();

      expect(matDialogSpy.open).toHaveBeenCalled();
    });
  });

  describe('getImage()', () => {
    it('should return a string, giving the url path to the card iamge', () => {
      const card = {
        value: 'K',
        suit: 'Hearts',
        weight: 10
      };

      const returnedPath = component.getImage(card);

      expect(returnedPath).toContain('assets/images/cards/KH.jpg');
    });
  });

  describe('ngDestroy()', () => {
    it('should make auth service call to update player', () => {
      component.ngOnDestroy();

      expect(mockAuthService.updatePlayer).toHaveBeenCalled();
    });
  });
});
