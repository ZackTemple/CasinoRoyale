import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';
import { Player } from './objects/player';
import { Table } from './objects/table';
import { BlackjackService } from './blackjack.service';
import { MatDialog } from '@angular/material/dialog';
import { HelperCardDialogComponent } from './helper-card-dialog/helper-card-dialog.component';
import { BlackjackAnimations } from './blackjack-animations';
import { ICard } from 'src/app/interfaces/cards';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css'],
  animations: BlackjackAnimations
})

export class BlackjackComponent implements OnInit, OnDestroy {

  gameInProgress = false;
  table: Table;
  player: Player;
  outcomes = {
    PlayerWins: 'playerwins',
    DealerWins: 'dealerwins',
    Tie: 'tie',
    Bust: 'bust'
  };

  constructor(
    private authService: AuthService,
    private gameService: BlackjackService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: Player) => {
        this.player = player;
        this.player.currentBet = 0;
      },
      (err: HttpTrackerError) => console.log(err)
    );
  }

  increasePlayerBet(betAmount: number): void {
    this.player.currentBet += betAmount;
  }

  clickPlaceBet(): void {
    this.gameService.startGame(this.player, this.player.currentBet).subscribe(
      (table: Table) => {
        this.table = table;
        this.player = this.table.player;
        console.log({table});
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
        console.log({table});
        this.player = table.player;
      },
      (err: HttpTrackerError) => {
        console.log(err.message);
      }
    );
  }

  clickStay(): void {
    this.gameService.finishGame(this.table).subscribe(
      (table: Table) => {
        this.table = table;
        this.player = table.player;
        this.updatePlayer();
      },
      (err: HttpTrackerError) => {
        console.log(err.message);
      }
    );
  }

  resetPlayerBet(): void {
    this.player.currentBet = 0;
  }

  clickPlayAgain(): void {
    this.gameInProgress = false;
  }

  ngOnDestroy(): void {
    this.updatePlayer();
  }

  updatePlayer(): void {
    this.authService.updatePlayer(this.player).subscribe();
  }

  showHelperCard(): void {
    this.dialog.open(HelperCardDialogComponent);
  }

  getImage(card: ICard): string {
    const imageDir = '../../../assets/images/cards/';
    const imageValue = card.value;
    const imageSuit = card.suit[0];
    const imageType = '.jpg';

    return imageDir.concat(imageValue, imageSuit, imageType);
  }

}
