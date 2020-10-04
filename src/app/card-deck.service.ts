import { Injectable } from '@angular/core';
import { ICard, ICardBlackjack } from './interfaces/cards';

@Injectable({
  providedIn: 'root'
})
export class CardDeckService {

  suits = ['Clovers', 'Diamonds', 'Hearts', 'Spades'];
  values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  constructor() { }

  // sets up blackjack deck where each card has a suit, value, and weight
  getDeckBlackjack(): ICardBlackjack[] {
    let i = 0;
    let j = 0;
    let currentSuit: string;
    let currentValue: string;
    let currentWeight: number;
    let card: ICardBlackjack;
    const deck = new Array();

    for (i = 0; i < this.suits.length; i++ ) {
      for (j = 0; j < this.values.length; j++ ) {
        currentSuit = this.suits[i];
        currentValue = this.values[j];

        if (currentValue === 'J' || currentValue === 'Q' || currentValue === 'K') {
          currentWeight = 10;
        }
        else if (currentValue === 'A') {
          currentWeight = 11;
        }
        else {
          currentWeight = parseInt(currentValue, 10);
        }

        card = {suit: currentSuit, value: currentValue, weight: currentWeight};
        deck.push(card);
      }
    }

    return deck;
  }

  // Use in the future for implementing more games
  getDeck(): any[] {
    let i = 0;
    let j = 0;
    let currentSuit: string;
    let currentValue: string;
    let card: ICard;
    const deck = new Array();

    for (i = 0; i < this.suits.length; i++ ) {
      for (j = 0; j < this.values.length; j++ ) {
        currentSuit = this.suits[i];
        currentValue = this.values[j];

        card = {suit: this.suits[i], value: currentValue};
        deck.push(card);
      }
    }
    return deck;
  }

  // Talk to Shawn about a shuffleDeck() method
}
