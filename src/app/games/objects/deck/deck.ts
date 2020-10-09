import { ICard, ICardBlackjack } from 'src/app/interfaces/cards';
import * as _ from 'lodash';

export class Deck {

  // Allows for mulitple decls to be retrieved
  deck: ICard[];
  blackjackDeck: ICardBlackjack[];
  suits = ['Clovers', 'Diamonds', 'Hearts', 'Spades'];
  values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  constructor() {
    this.deck = this.getDeck();
    this.blackjackDeck = this.getBlackjackDeck();
  }

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


  getBlackjackDeck(): ICardBlackjack[] {
    const cardDeck = this.getDeck();
    return this.appendWeightsForBlackjack(cardDeck);
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


  // Implements the Fisher-Yates (aka Knuth) Shuffle method found at:
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffleDeck(deck: ICard[] | ICardBlackjack[]): ICard[] | ICardBlackjack[] {
    let currentIndex = deck.length;
    let temporaryValue: number;
    let randomIndex: number;
    const shuffledDeck = _.cloneDeep(deck);

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = shuffledDeck[currentIndex];
      shuffledDeck[currentIndex] = shuffledDeck[randomIndex];
      shuffledDeck[randomIndex] = temporaryValue;
    }

    return shuffledDeck;
  }

  reset(): void {
    this.deck = this.getDeck();
    this.blackjackDeck = this.getBlackjackDeck();
  }
}
