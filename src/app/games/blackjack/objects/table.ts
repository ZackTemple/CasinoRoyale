import { Player } from './player';

export class Table {
  players = new Array();

  constructor(players: any[]) {
    this.players = players;
  }

  addNewPlayer(player: Player): void {
    this.players.push(player);
  }

  // May have to change in the future to look for object with specific username
  removePlayer(player: Player): void {
    const index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    }
  }
}
