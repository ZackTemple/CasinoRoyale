import { ICard, ICardBlackjack } from 'src/app/interfaces/cards';
import { Deck } from './deck/deck';
import { DeckService } from './deck/deck.service';

export class Dealer {

  constructor(private deckService: DeckService) {
  }

  dealCardsToPlayers(): void {
    // shuffle deck on start of game
    let blackjackDeck = new Deck().blackjackDeck; // this.deckService.shuffleDeck(this.deck) as ICardBlackjack[];

    // distribute cards
    let dealerHand = shuffledDeck.splice(0, 1);
    let playerHand = shuffledDeck.splice(0, 2);

    // Must check to see if user busts on deal
    this.playerBustQ(this.getScore(this.playerHand));
  }



}
