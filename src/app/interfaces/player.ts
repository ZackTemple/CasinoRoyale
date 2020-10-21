// Interface for Player
export interface IPlayer {
  username: string;
  password: string;
  active: boolean;
  currentMoney: number;
  totalEarned: number;
  totalLost: number;
  id: string;
}
