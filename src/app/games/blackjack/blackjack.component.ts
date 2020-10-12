import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { IPlayer } from 'src/app/interfaces/player';
import { ICard } from '../../interfaces/cards';
import { Dealer } from './objects/dealer';
import { Player } from './objects/player';
import { Table } from './objects/table';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

export class BlackjackComponent implements OnInit, OnDestroy {

  // Objects: dealer, player, and table
  dealer: Dealer;
  player: Player;
  localStoragePlayerInfo: IPlayer;
  table: Table;

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
    this.dealer = new Dealer();

    this.localStoragePlayerInfo = JSON.parse(localStorage.getItem('Authorization')) as IPlayer;
    // TODO: fix database with Shawn
    this.localStoragePlayerInfo.totalEarned = Number(this.localStoragePlayerInfo.totalEarned);
    this.localStoragePlayerInfo.totalLost = Number(this.localStoragePlayerInfo.totalLost);

    this.player = new Player(this.localStoragePlayerInfo);
    this.table = new Table([this.dealer, this.player]);
  }

  onClickPlaceBet(): void {
    if ( 0 < this.player.bet && this.player.bet <= this.player.currentMoney) {
      this.resetGameAttributes();
      this.startGame();
    }
  }

  resetGameAttributes(): void {
    this.resetComponentAttributes();
    this.dealer.collectOldCards(this.table);
    this.dealer.resetDeck();
  }

  resetComponentAttributes(): void {
    this.betLockedIn = true;
    this.winner = null;
    this.tie = false;
    this.bust = false;
  }

  startGame(): void {
    this.dealer.subtractBetFromPlayerWallet(this.player);
    this.dealer.shuffleDeck();
    this.dealer.dealCardsToStartGame(this.table.players);
  }

  clickHit(): void {
    this.dealer.dealCardToPlayer(this.player, 1);
    this.playerBustQ();
  }

  playerBustQ(): void {
    this.player.score = this.getScore(this.player.cards);
    if (this.player.score > 21) {
      this.endGameFromUserBust();
    }
  }

  getScore(hand: ICard[]): number {
    let totalScore = 0;

    hand.map(card => {
      totalScore += card.weight;
    });

    return totalScore;
  }

  endGameFromUserBust(): void {
    this.bust = true;
    this.winner = this.dealer;
    this.updateLocalStorage();
  }



  clickStay(): void {
    this.player.score = this.getScore(this.player.cards);

    this.finishGame();
  }

  finishGame(): void {
    this.playDealersTurn();
    this.getGameResults();
    this.actOnGameResults();
    this.updateLocalStorage();
  }

  playDealersTurn(): void {
    this.dealer.score = this.getScore(this.dealer.cards);

    // Dealer keeps hitting until score is 17 or more
    while (this.dealer.score < 17 && this.dealer.score <= this.player.score) {
      this.dealer.dealCardToPlayer(this.dealer, 1);
      this.dealer.score = this.getScore(this.dealer.cards);
    }
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
