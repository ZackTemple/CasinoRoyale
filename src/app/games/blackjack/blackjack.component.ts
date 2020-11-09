import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PlayerTrackerError } from 'src/app/auth/player-tracker-error';
import { IPlayer } from 'src/app/interfaces/player';
import { Dealer } from './objects/dealer';
import { Player } from './objects/player';
import { Table } from './objects/table';
import * as _ from 'lodash';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

export class BlackjackComponent implements OnInit {

  // Objects: dealer, player, and table
  dealer: Dealer;
  player: Player;
  table: Table;

  // Property for handling the initial bet
  betLockedIn = false;

  // Final winner, tie, and bust
  winner: Player | Dealer;
  tie = false;
  bust = false;

  // gives user ability to see playing card
  showHelperCard = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.dealer = new Dealer();

    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: IPlayer) => {
        this.player = new Player(player);
        this.table = new Table([this.dealer, this.player]);
      },
      (err: PlayerTrackerError) => console.log(err)
    );
  }

  onClickPlaceBet(): void {
    if ( 0 < this.player.bet && this.player.bet <= this.player.currentMoney) {
      this.setupNewGame();
      this.startGame();
    }
    else {
      this.betLockedIn = false;
    }
  }

  setupNewGame(): void {
    this.resetGameAttributes();
    this.dealer.collectOldCards(this.table);
    this.dealer.resetDeck();
  }

  private resetGameAttributes(): void {
    this.betLockedIn = true;
    this.winner = null;
    this.tie = false;
    this.bust = false;
    this.player.score = 0;
    this.dealer.score = 0;
  }

  startGame(): void {
    this.dealer.subtractBetFromPlayerWallet(this.player);
    this.dealer.shuffleDeck();
    // this.dealer.dealCardsToStartGame(this.table.players);

    this.player.cards = [
      {suit: 'Hearts', value: 'A', weight: 11},
      {suit: 'Spades', value: 'J', weight: 10}
    ];
    this.dealer.cards = [
      {suit: 'Diamonds', value: 'A', weight: 11}
    ];
  }

  clickHit(): void {
    this.dealer.dealCardToPlayer(this.player, 1);
    this.playerBustQ();
  }

  playerBustQ(): void {
    this.getScore(this.player);
    this.handleAces(this.player);
    if (this.player.score > 21) {
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
    this.bust = true;
    this.winner = this.dealer;
    this.getScore(this.dealer);
    this.actOnGameResults();
    this.updatePlayer();
  }



  clickStay(): void {
    this.getScore(this.player);

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
    this.getScore(this.dealer);
    this.handleAces(this.dealer);

    // Dealer keeps hitting until score is 17 or more
    while (this.dealer.score < 17 && this.dealer.score <= this.player.score) {
      this.dealer.dealCardToPlayer(this.dealer, 1);
      this.getScore(this.dealer);
      this.handleAces(this.dealer);
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
    else {
      this.player.totalLost += this.player.bet;
    }
  }

  updatePlayer(): void {
    this.authService.updatePlayer(this.player).subscribe();
  }

  toggleHelperCard(): void {
    this.showHelperCard = !this.showHelperCard;
  }

}
