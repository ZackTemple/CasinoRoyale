import { Dealer } from './dealer';
import { Player } from './player';

export class Table {
  player: Player;
  dealer = new Dealer();
  result: any;
}
