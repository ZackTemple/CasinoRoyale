import { ICard } from 'src/app/interfaces/cards';
import * as _ from 'lodash';
import { Deck } from './deck';
import { Player } from './player';
import { Table } from './table';

export class Dealer {

  name: string;

  cards: ICard[] = new Array();
  score: number;
  deck: Deck;

  constructor(name = 'Dealer Dan') {
    // this.deck = new Deck();
    this.name = name;
  }

  subtractBetFromPlayerWallet(player: Player): void {
    player.currentMoney -= player.bet;
  }

  shuffleDeck(): void {
    let currentIndex = this.deck.cards.length;
    let temporaryCard: ICard;
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryCard = this.deck.cards[currentIndex];
      this.deck.cards[currentIndex] = this.deck.cards[randomIndex];
      this.deck.cards[randomIndex] = temporaryCard;
    }
  }

  // dealCardsToStartGame(players: any[]): void {
  //   let i: number;

  //   for (i = 0; i < players.length; i++) {
  //     this.dealCardToPlayer(
  //       players[i],
  //       this.determineNumberOfCards(players[i])
  //     );
  //   }
  // }

  // private determineNumberOfCards(player: Player | Dealer): number {
  //   // If the name is the dealer's name, only deal one
  //   if (player.name === this.name) {
  //     return 1;
  //   }
  //   else {
  //     return 2;
  //   }
  // }

  dealCardToPlayer(player: Player | Dealer, numOfCards: number): void {
    const newCards = this.deck.cards.splice(0, numOfCards);
    player.cards = player.cards.concat(newCards);
  }

  resetDeck(): void {
    this.deck.cards = this.deck.getDeck();
  }

  awardPlayer(player: Player): void {
    // update player info depending on game results
    const multiplier = this.getBetMulitplier(player.score);

    player.currentMoney += multiplier * player.bet;
    player.totalEarned += multiplier * player.bet;
  }

  private getBetMulitplier(playerScore): number {
    if (playerScore === 21) {
      return 2.5;
    }
    else {
      return 2;
    }
  }

  returnPlayerBet(player: Player): void {
    player.currentMoney += player.bet;
    player.totalEarned += player.bet;
  }

  // collectOldCards(table: Table): void {
  //   let i: number;

  //   for (i = 0; i < table.players.length; i++) {
  //     this.gatherCardsFromPlayer(table.players[i]);
  //   }
  // }

  private gatherCardsFromPlayer(player: Player | Dealer): void {
    player.cards = new Array();
  }

}
