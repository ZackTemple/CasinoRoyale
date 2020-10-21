import { ICard } from 'src/app/interfaces/cards';
import { IPlayer } from 'src/app/interfaces/player';

export class Player implements IPlayer {

  // General Player Information
  username: string;
  password: string;
  active: boolean;
  currentMoney: number;
  totalEarned: number;
  totalLost: number;
  _id: string;

  // Game information
  name: string;
  bet: number;
  cards: ICard[] = new Array();
  score: number;

  constructor(playerInfo: IPlayer) {
    this.setPlayerInfo(playerInfo);
  }

  setPlayerInfo(playerInfo): void {
    this.username = this.name = playerInfo.username,
    this.password = playerInfo.password,
    this.active = playerInfo.active,
    this.currentMoney = playerInfo.currentMoney,
    this.totalEarned = playerInfo.totalEarned,
    this.totalLost = playerInfo.totalLost,
    this._id = playerInfo._id;
  }
}