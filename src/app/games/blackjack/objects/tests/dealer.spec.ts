import { Dealer } from '../dealer';
import { Player } from '../player';

describe('Dealer Object', () => {
  let dealer: Dealer;
  let player: Player;

  beforeEach(() => {
    dealer = new Dealer();
    player = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      id: 'id-here'
    });
  });

});
