import { ICard } from 'src/app/interfaces/cards';
import * as _ from 'lodash';

export class Deck {

  // Allows for mulitple decls to be retrieved
  cards: ICard[];
  suits = ['Clovers', 'Diamonds', 'Hearts', 'Spades'];
  values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  constructor() {
    this.cards = this.getDeck();
  }

  getDeck(): any[] {
    let i = 0;
    let j = 0;
    let currentSuit: string;
    let currentValue: string;
    let currentWeight: number;
    let card: ICard;
    const deck = new Array();

    for (i = 0; i < this.suits.length; i++ ) {
      for (j = 0; j < this.values.length; j++ ) {
        currentSuit = this.suits[i];
        currentValue = this.values[j];
        currentWeight = this.getWeight(currentSuit, currentValue);

        card = {suit: currentSuit, value: currentValue, weight: currentWeight};
        deck.push(card);
      }
    }
    return deck;
  }

  // Function gets the weight for a specific card based on it's value
  getWeight(suit: string, value: string): number {
    let cardWeight: number;
    if (value === 'J' || value === 'Q' || value === 'K') {
      cardWeight = 10;
    }
    else if (value === 'A') {
      cardWeight = 11;
    }
    else {
      cardWeight = parseInt(value, 10);
    }
    return cardWeight;
  }
}
