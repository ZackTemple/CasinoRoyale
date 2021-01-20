import { of } from 'rxjs';
import { Player } from '../games/blackjack/objects/player';

import { DepositMoneyComponent } from './deposit-money.component';

describe('DepositMoneyComponent', () => {
  let component: DepositMoneyComponent;
  let mockAuthService;
  const playerObject = new Player({
    username: 'foo',
    password: 'bar',
    active: false,
    currentMoney: 900,
    totalEarned: 1000,
    totalLost: 100
  });

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['getPlayer', 'updatePlayer']);
    mockAuthService.getPlayer.and.returnValue(of(playerObject));
    mockAuthService.updatePlayer.and.returnValue(of(playerObject));
    component = new DepositMoneyComponent(mockAuthService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call auth service to get player', () => {
      component.ngOnInit();
      expect(mockAuthService.getPlayer).toHaveBeenCalled();
    });
  });

  describe('addMoney', () => {
    it('should set the players currentMoney to $500 if the amount is less than $500', () => {
      component.player = playerObject;
      component.player.currentMoney = 100;
      component.moneyAdded = false;

      component.addMoney();

      expect(component.player.currentMoney).toBe(500);
      expect(mockAuthService.updatePlayer).toHaveBeenCalled();
      expect(component.moneyAdded).toBeTruthy();
    });

    it('should do nothing if players current money is greater than or equal to $500', () => {
      component.player = playerObject;
      component.player.currentMoney = 500;
      component.moneyAdded = false;

      component.addMoney();

      expect(component.player.currentMoney).toBe(500);
      expect(mockAuthService.updatePlayer).toHaveBeenCalledTimes(0);
      expect(component.moneyAdded).toBeFalsy();
    });
  });
});
