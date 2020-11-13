import { Dealer } from './dealer';
import { Player } from './player';

export class Table {
  player: Player;
  dealer = new Dealer();
  result: any;

  constructor(player: Player) {
    this.player = player;

    this.player.score = 0;
    this.dealer.score = 0;

    this.player.cards = new Array();

    this.result = null;
  }
}
