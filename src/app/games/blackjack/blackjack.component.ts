import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PlayerTrackerError } from 'src/app/auth/player-tracker-error';
import { IPlayer } from 'src/app/interfaces/player';
import { Dealer } from './objects/dealer';
import { Player } from './objects/player';
import { Table } from './objects/table';
import * as _ from 'lodash';
import { BlackjackService } from './blackjack.service';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

export class BlackjackComponent implements OnInit {

  // Objects: dealer, player, and table
  table: Table;

  // Property for handling the initial bet
  betLockedIn = false;

  // Final winner, tie, and bust
  winner: any;
  tie: any;
  bust: any;
  outcomes = {
    Winner: 'winner',
    Tie: 'tie',
    Bust: 'bust'
  };

  outcome: any;

  // gives user ability to see playing card
  showHelperCard = false;

  constructor(
    private authService: AuthService,
    private gameService: BlackjackService) {
  }

  ngOnInit(): void {
    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: Player) => {
        this.table = new Table(player);
      },
      (err: PlayerTrackerError) => console.log(err)
    );
  }

  onClickPlaceBet(): void {
    if ( 0 < this.table.player.bet && this.table.player.bet <= this.table.player.currentMoney) {
      this.resetGame();
      this.startNewGame();
    }
    else {
      this.betLockedIn = false;
    }
  }

  private resetGame(): void {
    this.betLockedIn = true;
    this.table = new Table(this.table.player);
  }

  private startNewGame(): void {
    this.gameService.startNewGame(this.table).subscribe(
      table => {
        console.log(table);
        this.table = table;
      }
    );
  }

  clickHit(): void {
    this.gameService.dealCardToPlayer(this.table);
    this.playerBustQ();
  }

  playerBustQ(): void {
    this.getScore(this.table.player);
    this.handleAces(this.table.player);
    if (this.table.player.score > 21) {
      this.endGameFromUserBust();
    }
  }

  handleAces(player: Player | Dealer): void {
    while (player.score > 21 && player.cards.findIndex(card => card['weight'] === 11) !== -1) {
      const index = player.cards.findIndex(card => card['weight'] === 11);
      const aceCard = _.clone(player.cards[index]);
      aceCard['weight'] = 1;

      player.cards.splice(index, 1);
      player.cards.push(aceCard);
      this.getScore(player);
    }
  }

  getScore(player: Player | Dealer): void {
    let totalScore = 0;
    const hand = player.cards;

    hand.map(card => {
      totalScore += card.weight;
    });

    player.score = totalScore;
  }

  endGameFromUserBust(): void {
    this.outcome = this.outcomes.Bust;
    this.winner = this.table.dealer;
    this.getScore(this.table.dealer);
    this.actOnGameResults();
    this.updatePlayer();
  }



  clickStay(): void {
    this.getScore(this.table.player);

    this.finishGame();
  }

  finishGame(): void {
    this.playDealersTurn();
    this.getGameResults();
    this.actOnGameResults();
    this.updatePlayer();
  }

  playDealersTurn(): void {
    // Get dealer info before entering loop to add more cards for dealer
    this.getScore(this.table.dealer);
    this.handleAces(this.table.dealer);

    // Dealer keeps hitting until score is 17 or more
    while (this.table.dealer.score < 17 && this.table.dealer.score <= this.table.player.score) {
      this.table.dealer.dealCardToPlayer(this.table.dealer, 1);
      this.getScore(this.table.dealer);
      this.handleAces(this.table.dealer);
    }
  }

  getGameResults(): void {
    if (this.table.player.score > this.table.dealer.score || this.table.dealer.score > 21) {
      this.winner = this.table.player;
    }
    else if (this.table.dealer.score > this.table.player.score) {
      this.winner = this.table.dealer;
    }
    else if (this.table.player.score === this.table.dealer.score) {
      this.tie = true;
    }
  }

  actOnGameResults(): void {
    if (this.winner === this.table.player) {
      this.table.dealer.awardPlayer(this.table.player);
    }
    else if (this.tie === true) {
      this.table.dealer.returnPlayerBet(this.table.player);
    }
    else {
      this.table.player.totalLost += this.table.player.bet;
    }
  }

  updatePlayer(): void {
    this.authService.updatePlayer(this.table.player).subscribe();
  }

  toggleHelperCard(): void {
    this.showHelperCard = !this.showHelperCard;
  }

}
