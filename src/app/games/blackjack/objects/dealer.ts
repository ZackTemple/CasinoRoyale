import { ICard } from 'src/app/interfaces/cards';

export class Dealer {
  name: string;
  cards: ICard[] = new Array();
  score: number;
}
