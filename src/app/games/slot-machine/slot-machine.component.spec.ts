import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from '../blackjack/objects/player';
import { SlotMachine } from './slot-machine';
import { SlotMachineComponent } from './slot-machine.component';

describe('SlotMachineComponent', () => {
  let component: SlotMachineComponent;
  let fixture: ComponentFixture<SlotMachineComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let playerObject: Player;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    playerObject = new Player({
      username: 'MichaelScott',
      password: 'password',
      active: false,
      currentMoney: 20,
      totalEarned: 20,
      totalLost: 10000
    });

    await TestBed.configureTestingModule({
      imports: [ MockModule(MatMenuModule), MockModule(FormsModule) ],
      declarations: [ SlotMachineComponent ],
      providers: [ {provide: AuthService , useValue: mockAuthService}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService.getPlayer.and.returnValue(of( playerObject ));
    mockAuthService.updatePlayer.and.returnValue(of( playerObject ));
    fixture = TestBed.createComponent(SlotMachineComponent);
    component = fixture.componentInstance;
    component.slotMachine = new SlotMachine();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validateBet', () => {
    beforeEach(() => {
      component.player.bet = 25;
      component.player.currentMoney = 50;
      component.winner = true;
    });

    it('should reset winner attribute to false for the new round and subtract bet from player wallet if valid', () => {
      const moneyBeforeValidation = component.player.currentMoney;
      spyOn(component.slotMachine, 'startSpin').and.callThrough();

      component.validateBet();

      expect(component.winner).toBeFalsy();
      expect(component.player.currentMoney).toBe(moneyBeforeValidation - component.player.currentMoney);
    });

    it('should start the spinning if the bet is valid', () => {
      spyOn(component.slotMachine, 'startSpin').and.callThrough();

      component.validateBet();

      expect(component.slotMachine.startSpin).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if the bet is invalid', () => {
      component.player.bet = component.player.currentMoney + 1;
      const moneyBeforeValidation = component.player.currentMoney;
      spyOn(component.slotMachine, 'startSpin').and.callThrough();

      component.validateBet();

      expect(component.winner).toBeTruthy();
      expect(component.player.currentMoney).toBe(moneyBeforeValidation);
      expect(component.slotMachine.startSpin).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkForWinner', () => {
    beforeEach(() => {
      component.player.bet = 5;
    });

    it('should do nothing if there are no matching rows', () => {
      spyOn(component.slotMachine, 'findNumberOfRowsWon').and.returnValue(0);
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();

      expect(component.player.currentMoney).toBe(moneyBeforeWinCheck);
    });

    it('should award the player 2 times the player bet if there is one matching row', () => {
      spyOn(component.slotMachine, 'findNumberOfRowsWon').and.returnValue(1);
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();
      const expectedNewWallet = moneyBeforeWinCheck + component.player.bet * 2;

      expect(component.player.currentMoney).toBe(expectedNewWallet);
    });

    it('should award the player 20 times the player bet if there are two matching rows', () => {
      spyOn(component.slotMachine, 'findNumberOfRowsWon').and.returnValue(2);
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();
      const expectedNewWallet = moneyBeforeWinCheck + component.player.bet * 20;

      expect(component.player.currentMoney).toBe(expectedNewWallet);
    });

    it('should award the player 1000 times the player bet if all rows are matching', () => {
      spyOn(component.slotMachine, 'findNumberOfRowsWon').and.returnValue(3);
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();
      const expectedNewWallet = moneyBeforeWinCheck + component.player.bet * 1000;

      expect(component.player.currentMoney).toBe(expectedNewWallet);
    });
  });

  describe('setGameMode', () => {
    it('should set the game mode from its input', () => {
      component.currentGameMode = component.gameModes.NORMAL;

      component.setGameMode(component.gameModes.EASY);

      expect(component.currentGameMode).toBe(component.gameModes.EASY);
    });
  });

  describe('The front end', () => {

    describe('winner', () => {
      it('should display a winner flag only if there is a winner', () => {
        component.winner = true;
        fixture.detectChanges();

        const winnerTag = fixture.nativeElement.querySelector('.winner') as HTMLScriptElement;
        expect(winnerTag.innerHTML).toContain('Winner');
      });

      it('should not display a winner flag if there is no winner', () => {
        component.winner = false;
        fixture.detectChanges();

        const winnerTag = fixture.nativeElement.querySelector('.winner') as HTMLScriptElement;
        expect(winnerTag).toBeNull();
      });
    });

    describe('betting-options', () => {
      it('should display betting options only if there is a player and has not begun a game', () => {
        component.player = playerObject;
        component.intervalQueue = [];
        fixture.detectChanges();

        const winnerTag = fixture.nativeElement.querySelector('.display-bet-options') as HTMLScriptElement;
        expect(winnerTag).not.toBeNull();
      });

      it('should not display betting options if a game has begun', () => {
        component.player = playerObject;
        component.intervalQueue = ['interval1', 'interval2', 'interval3'];
        fixture.detectChanges();

        const winnerTag = fixture.nativeElement.querySelector('.display-bet-options') as HTMLScriptElement;
        expect(winnerTag).toBeNull();
      });

      it('should not display betting options if there is no player', () => {
        component.player = null;
        component.intervalQueue = [];
        fixture.detectChanges();

        const winnerTag = fixture.nativeElement.querySelector('.display-bet-options') as HTMLScriptElement;
        expect(winnerTag).toBeNull();
      });
    });

    describe('in-game-options', () => {
      it('should display in-game options only if there is a player and a game has begun', () => {
        component.player = playerObject;
        component.intervalQueue = ['interval1', 'interval2', 'interval3'];
        fixture.detectChanges();

        const winnerTag = fixture.nativeElement.querySelector('.in-game-options') as HTMLScriptElement;
        expect(winnerTag).not.toBeNull();
      });

      it('should not display in-game options if a game has not begun', () => {
        component.player = playerObject;
        component.intervalQueue = [];
        fixture.detectChanges();

        const winnerTag = fixture.nativeElement.querySelector('.in-game-options') as HTMLScriptElement;
        expect(winnerTag).toBeNull();
      });

      it('should not display in-game options if there is no player', () => {
        component.player = null;
        component.intervalQueue = ['interval1', 'interval2', 'interval3'];
        fixture.detectChanges();

        const winnerTag = fixture.nativeElement.querySelector('.in-game-options') as HTMLScriptElement;
        expect(winnerTag).toBeNull();
      });
    });
  });

  describe('updatePlayer()', () => {
    it('makes an http call to update the player', () => {
      component.updatePlayer();
      expect(mockAuthService.updatePlayer).toHaveBeenCalled();
    });
  });
});
