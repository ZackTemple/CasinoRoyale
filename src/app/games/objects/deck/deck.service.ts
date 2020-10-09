import { Injectable } from '@angular/core';
import { ICard, ICardBlackjack } from '../../../interfaces/cards';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  suits = ['Clovers', 'Diamonds', 'Hearts', 'Spades'];
  values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  constructor() { }

  getBlackjackDeck(): ICardBlackjack[] {
    const cardDeck = this.getDeck();
    return this.appendWeightsForBlackjack(cardDeck);
  }

  // Use in the future for implementing more games
  getDeck(): ICard[] {
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


  // map over getWeight() method, which grabs the weight for each card
  appendWeightsForBlackjack(cardDeck: ICard[]): ICardBlackjack[] {
    return cardDeck.map(this.getWeight);
  }

  // Function gets the weight for a specific card based on it's value
  getWeight(card: ICard): ICardBlackjack {
    let cardWeight: number;
    if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
      cardWeight = 10;
    }
    else if (card.value === 'A') {
      cardWeight = 11;
    }
    else {
      cardWeight = parseInt(card.value, 10);
    }
    return {...card, weight: cardWeight};
  }
}
