import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MockModule } from 'ng-mocks';
import { Observable, of, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from '../blackjack/objects/player';
import { BreakpointsHeightSizes, BreakpointsWidthSizes } from './breakpoints';
import { SlotMachine } from './slot-machine';
import { SlotMachineComponent } from './slot-machine.component';

describe('SlotMachineComponent', () => {
  let component: SlotMachineComponent;
  let fixture: ComponentFixture<SlotMachineComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockBreakpointObserver: any;
  let playerObject: Player;
  let windowSizeSubject: Subject<BreakpointState>;
  let returnedObservable: Observable<BreakpointState>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    mockBreakpointObserver = jasmine.createSpyObj(['observe']);
    windowSizeSubject = new Subject();
    returnedObservable = windowSizeSubject;

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
      providers: [
        {provide: AuthService , useValue: mockAuthService},
        {provide: BreakpointObserver , useValue: mockBreakpointObserver}
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService.getPlayer.and.returnValue(of( playerObject ));
    mockAuthService.updatePlayer.and.returnValue(of( playerObject ));

    mockBreakpointObserver.observe.and.returnValue(returnedObservable);

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
      component.player.currentBet = 25;
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
      component.player.currentBet = component.player.currentMoney + 1;
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
      component.player.currentBet = 5;
    });

    it('should do nothing if there are no matching rows', () => {
      spyOn(component.slotMachine, 'findNumberOfRowsWon').and.returnValue(0);
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();

      expect(component.player.currentMoney).toBe(moneyBeforeWinCheck);
    });

    it('should award the player accordingly if there is one matching row', () => {
      spyOn(component.slotMachine, 'findNumberOfRowsWon').and.returnValue(1);
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();
      const expectedNewWallet = moneyBeforeWinCheck + component.payoutEquation(1);

      expect(component.player.currentMoney).toBe(expectedNewWallet);
    });

    it('should award the player accordingly if there are two matching rows', () => {
      spyOn(component.slotMachine, 'findNumberOfRowsWon').and.returnValue(2);
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();
      const expectedNewWallet = moneyBeforeWinCheck + component.payoutEquation(2);

      expect(component.player.currentMoney).toBe(expectedNewWallet);
    });

    it('should award the player accordingly if all rows are matching', () => {
      spyOn(component.slotMachine, 'findNumberOfRowsWon').and.returnValue(3);
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();
      const expectedNewWallet = moneyBeforeWinCheck + component.payoutEquation(3);

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

    describe('The changing window size', () => {

      describe('for width', () => {
        it('should set topBottomLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1000px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.topBottomLightsArray.length).toEqual(BreakpointsWidthSizes.XSmall.lights);
        });
        it('should set topBottomLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1200px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.topBottomLightsArray.length).toEqual(BreakpointsWidthSizes.Small.lights);
        });
        it('should set topBottomLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1400px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.topBottomLightsArray.length).toEqual(BreakpointsWidthSizes.Medium.lights);
        });
        it('should set topBottomLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1600px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.topBottomLightsArray.length).toEqual(BreakpointsWidthSizes.Large.lights);
        });
        it('should set topBottomLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1800px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.topBottomLightsArray.length).toEqual(BreakpointsWidthSizes.XLarge.lights);
        });
        it('should set topBottomLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 2000px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.topBottomLightsArray.length).toEqual(BreakpointsWidthSizes.XXLarge.lights);
        });
      });

      describe('for height', () => {
        it('should set sidesLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-height: 400px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.sidesLightsArray.length).toEqual(BreakpointsHeightSizes.XSmall.lights);
        });
        it('should set sidesLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-height: 550px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.sidesLightsArray.length).toEqual(BreakpointsHeightSizes.Small.lights);
        });
        it('should set sidesLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-height: 700px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.sidesLightsArray.length).toEqual(BreakpointsHeightSizes.Medium.lights);
        });
        it('should set sidesLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-height: 850px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.sidesLightsArray.length).toEqual(BreakpointsHeightSizes.Large.lights);
        });
        it('should set sidesLightsArray to an array with length respective to the number of lights', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-height: 1000px)': true}};

          windowSizeSubject.next(initialState);

          expect(component.sidesLightsArray.length).toEqual(BreakpointsHeightSizes.XLarge.lights);
        });
      });

      describe('In desktop view', () => {
        it('shows lights around machine', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1000px)': true}};

          windowSizeSubject.next(initialState);
          fixture.detectChanges();

          const lightRows = fixture.nativeElement.querySelectorAll('.lights-row') as NodeList;
          expect(lightRows.length).toBe(4);
        });

        it('displays flashing lights if winner', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1000px)': true}};
          windowSizeSubject.next(initialState);
          component.winner = true;
          fixture.detectChanges();

          const flashingLights = fixture.nativeElement.querySelectorAll('.flashing-light') as NodeList;
          const regularLights = fixture.nativeElement.querySelectorAll('.light') as NodeList;
          expect(flashingLights.length).toBeGreaterThan(0);
          expect(regularLights.length).toBe(0);
        });

        it('displays regular lights if no winner', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1000px)': true}};
          windowSizeSubject.next(initialState);
          component.winner = false;
          fixture.detectChanges();

          const flashingLights = fixture.nativeElement.querySelectorAll('.flashing-light') as NodeList;
          const regularLights = fixture.nativeElement.querySelectorAll('.light') as NodeList;
          expect(flashingLights.length).toBe(0);
          expect(regularLights.length).toBeGreaterThan(0);
        });
      });
      describe('In mobile view', () => {
        it('does not show lights around machine', () => {
          const initialState: BreakpointState = {matches: true, breakpoints: {'(min-width: 1000px)': false}};

          windowSizeSubject.next(initialState);
          fixture.detectChanges();

          const lightRows = fixture.nativeElement.querySelectorAll('.lights-row') as NodeList;
          expect(lightRows.length).toBe(0);
        });
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
