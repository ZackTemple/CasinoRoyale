import { of } from 'rxjs';
import { Player } from '../games/blackjack/objects/player';

import { DepositMoneyComponent } from './deposit-money.component';

describe('DepositMoneyComponent', () => {
  let component: DepositMoneyComponent;
  let mockAuthService;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['getPlayer']);

    component = new DepositMoneyComponent(mockAuthService);

    component.player = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      id: 'id-here'
    });
    mockAuthService.getPlayer.and.returnValue(of(component.player));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
