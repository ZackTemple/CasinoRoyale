import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';
import { Player } from './objects/player';
import { Table } from './objects/table';
import * as _ from 'lodash';
import { BlackjackService } from './blackjack.service';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

export class BlackjackComponent implements OnInit, OnDestroy {

  // Objects: dealer, player, and table
  table: Table;
  player: Player;

  // Property for handling UI to allow for repeated games
  gameInProgress = false;

  // Final winner, tie, and bust
  winner: any;
  tie: any;
  bust: any;
  outcomes = {
    PlayerWins: 'playerwins',
    DealerWins: 'dealerwins',
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
        this.player = player;
      },
      (err: HttpTrackerError) => console.log(err)
    );
  }

  onClickPlaceBet(betString: string): void {
    const bet = parseInt(betString, 10);

    this.gameService.startGame(this.player, bet).subscribe(
      (table: Table) => {
        this.table = table;
        this.player = this.table.player;
        this.gameInProgress = true;
      },
      (err: HttpTrackerError) => {
        console.log(err.message);
      }
    );
  }

  clickHit(): void {
    this.gameService.dealCardToPlayer(this.table).subscribe(
      (table: Table) => {
        this.table = table;
        this.player = table.player;
        if (table.result) { this.gameInProgress = false; }
      },
      (err: HttpTrackerError) => {
        console.log(err);
      }
    );
  }

  clickStay(): void {
    this.gameService.finishGame(this.table).subscribe(
      (table: Table) => {
        this.table = table;
        this.player = table.player;
        this.gameInProgress = false;
      },
      (err: HttpTrackerError) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    this.authService.updatePlayer(this.player).subscribe();
  }

  toggleHelperCard(): void {
    this.showHelperCard = !this.showHelperCard;
  }

}
