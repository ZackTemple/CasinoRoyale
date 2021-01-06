import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';
import { Player } from './objects/player';
import { Table } from './objects/table';
import { BlackjackService } from './blackjack.service';
import { MatDialog } from '@angular/material/dialog';
import { HelperCardDialogComponent } from './helper-card-dialog/helper-card-dialog.component';
import { BlackjackAnimations } from './blackjack-animations';

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
      (player: Player) => this.player = player,
      (err: HttpTrackerError) => console.log(err)
    );
  }

  onClickPlaceBet(betString: string): void {
    const bet = parseInt(betString, 10);

    this.gameService.startGame(this.player, bet).subscribe(
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
        console.log({table});
        this.player = table.player;
        this.gameInProgress = false;
        this.updatePlayer();
      },
      (err: HttpTrackerError) => {
        console.log(err);
      }
    );
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

  getImage(card: any): string {
    const imageDir = '../../../assets/images/cards/';
    const imageValue = card.value;
    const imageSuit = card.suit[0];
    const imageType = '.jpg';

    return imageDir.concat(imageValue, imageSuit, imageType);
  }

}
