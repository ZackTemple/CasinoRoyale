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
  id: string;

  // Game information
  currentBet: number;
  cards: ICard[];
  score: number;

  constructor(playerInfo: IPlayer) {
    this.setPlayerInfo(playerInfo);
  }

  setPlayerInfo(playerInfo: IPlayer): void {
    this.username = playerInfo.username,
    this.password = playerInfo.password,
    this.active = playerInfo.active,
    this.currentMoney = playerInfo.currentMoney,
    this.totalEarned = playerInfo.totalEarned,
    this.totalLost = playerInfo.totalLost;
  }
}
