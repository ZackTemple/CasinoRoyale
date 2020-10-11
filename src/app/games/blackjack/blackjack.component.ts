import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { IPlayer } from 'src/app/interfaces/player';
import { ICard } from '../../interfaces/cards';
import { Dealer } from './objects/dealer';
import { Deck } from './objects/deck';
import { Player } from './objects/player';
import * as _ from 'lodash';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

export class BlackjackComponent implements OnInit, OnDestroy {

  // Objects: deck, dealer, and player
  deck: Deck;
  dealer: Dealer;
  player: Player;
  localStoragePlayerInfo: IPlayer;

  // Properties for handling the initial bet
  validBet = true;
  betLockedIn = false;

  // Final winner, tie, and bust
  winner: Player | Dealer;
  tie = false;
  bust = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    // giving Deck(true) gives us a blackjack deck
    this.deck = new Deck();
    this.dealer = new Dealer();

    this.localStoragePlayerInfo = JSON.parse(localStorage.getItem('Authorization')) as IPlayer;
    // TODO: fix database with Shawn
    this.localStoragePlayerInfo.totalEarned = Number(this.localStoragePlayerInfo.totalEarned);
    this.localStoragePlayerInfo.totalLost = Number(this.localStoragePlayerInfo.totalLost);

    this.player = new Player(this.localStoragePlayerInfo);
  }

  onClickPlaceBet(): void {
    if ( 0 < this.player.bet && this.player.bet <= this.player.currentMoney) {
      this.resetGameAttributes();
      this.startGame();
    }
  }

  resetGameAttributes(): void {
    this.betLockedIn = true;
    this.winner = null;
    this.tie = false;
    this.bust = false;
    this.dealer.resetDeck(this.deck);
  }

  startGame(): void {
    this.dealer.subtractBetFromPlayerWallet(this.player);
    this.dealer.shuffleDeck(this.deck);
    console.log(this.deck);

    this.dealCards();
  }

  dealCards(): void {
    this.player.cards = this.dealer.dealCards(this.deck, 2);
    this.dealer.cards = this.dealer.dealCards(this.deck, 1);
  }



  clickHit(): void {
    this.player.cards.push(this.newCard());
    this.playerBustQ();
  }

  newCard(): any {
    return this.dealer.dealCards(this.deck, 1)[0];
  }

  playerBustQ(): void {
    this.player.score = this.getScore(this.player.cards);
    if (this.player.score > 21) {
      this.endGameFromUserBust();
    }
  }

  endGameFromUserBust(): void {
    this.bust = true;
    this.winner = this.dealer;
    this.updateLocalStorage();
  }



  clickStay(): void {
    this.player.score = this.getScore(this.player.cards);
    this.player.turn = false;

    this.finishGame();
  }

  finishGame(): void {
    // Let dealer make moves, decide winner, and update player info with results
    this.playDealersTurn();
    this.getGameResults();
    this.actOnGameResults();
    this.updateLocalStorage();
  }

  playDealersTurn(): void {
    this.dealer.score = this.getScore(this.dealer.cards);

    // Dealer keeps hitting until score is 17 or more
    while (this.dealer.score < 17 && this.dealer.score <= this.player.score) {
      this.dealer.cards.push(this.newCard());
      this.dealer.score = this.getScore(this.dealer.cards);
    }
  }

  getScore(hand: ICard[]): number {
    let totalScore = 0;

    hand.map(card => {
      totalScore += card.weight;
    });

    return totalScore;
  }

  getGameResults(): void {
    if (this.player.score > this.dealer.score || this.dealer.score > 21) {
      this.winner = this.player;
    }
    else if (this.dealer.score > this.player.score) {
      this.winner = this.dealer;
    }
    else if (this.player.score === this.dealer.score) {
      this.tie = true;
    }
  }

  actOnGameResults(): void {
    if (this.winner === this.player) {
      this.dealer.awardPlayer(this.player);
    }
    else if (this.tie === true) {
      this.dealer.returnPlayerBet(this.player);
    }
  }

  updateLocalStorage(): void {

    localStorage.setItem('Authorization', JSON.stringify(this.player));
  }

  ngOnDestroy(): void {
    this.authService.updatePlayer(this.player).subscribe();
  }

}
