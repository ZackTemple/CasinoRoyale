import { ICard } from 'src/app/interfaces/cards';
import * as _ from 'lodash';
import { Deck } from './deck';
import { Player } from './player';

export class Dealer {

  name = 'Dealer Don';

  cards: ICard[];
  score: number;

  constructor() {
  }

  dealCards(deck: Deck, numOfCards: number): ICard[] {
    return deck.cards.splice(0, numOfCards);
  }

  shuffleDeck(deck: Deck): void {
    let currentIndex = deck.cards.length;
    let temporaryCard: ICard;
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryCard = deck.cards[currentIndex];
      deck.cards[currentIndex] = deck.cards[randomIndex];
      deck.cards[randomIndex] = temporaryCard;
    }
  }

  resetDeck(deck: Deck): void {
    deck.cards = deck.getDeck();
  }

  subtractBetFromPlayerWallet(player: Player): void {
    player.currentMoney -= player.bet;
    player.totalLost -= player.bet;
  }

  awardPlayer(player: Player): void {
    // update player info depending on game results
    player.currentMoney += 2 * player.bet;
    player.totalEarned += 2 * player.bet;
  }

  returnPlayerBet(player: Player): void {
    player.currentMoney += player.bet;
    player.totalEarned += player.bet;
  }

}
