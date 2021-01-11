import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';
import { Player } from '../blackjack/objects/player';
import { IGameMode } from './igame-mode';
import { SlotMachine } from './slot-machine';

@Component({
  selector: 'app-slot-machine',
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SlotMachineComponent implements OnInit, OnDestroy {

  currentGameMode: IGameMode;
  gameModes = {
    GODMODE: {description: 'God Mode', speed: 5},
    NORMAL: {description: 'Normal', speed: 50},
    EASY: {description: 'Easy', speed: 400}
  };
  intervalQueue: any[] = [];
  player: Player;
  slotMachine: SlotMachine;
  winner = false;

  public constructor(public authService: AuthService) {

  }

  private static findWinMulitplier(rowsWon: number): number {
    const oneRowWinner = 2;
    const twoRowWinner = 20;
    const threeRowWinner = 1000;

    return rowsWon === 1 ? oneRowWinner :
      rowsWon === 2 ? twoRowWinner :
      threeRowWinner;
  }

  ngOnInit(): void {
    this.currentGameMode = this.gameModes.NORMAL;
    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: Player) => this.player = player,
      (err: HttpTrackerError) => console.log(err)
    );
    this.slotMachine = new SlotMachine();
  }

  validateBet(): void {
    if (this.player.bet <= this.player.currentMoney) {
      this.winner = false;
      this.subtractPlayerBet();
      this.intervalQueue = this.slotMachine.startSpin(this.currentGameMode.speed);
    }
  }

  private subtractPlayerBet(): void {
    this.player.currentMoney -= this.player.bet;
    this.player.totalLost -= this.player.bet;
    this.updatePlayer();
  }

  stopSpin(): void {
    const columnToStop = this.intervalQueue.shift();
    clearInterval(columnToStop);
    if (this.intervalQueue.length === 0) { this.checkForWinner(); }
  }

  checkForWinner(): void {
    const numOfRowsWon = this.slotMachine.findNumberOfRowsWon();

    if (numOfRowsWon > 0) {
      this.winner = true;
      const winMulitplier = SlotMachineComponent.findWinMulitplier(numOfRowsWon);
      this.awardPlayer(winMulitplier);
    }
  }

  private awardPlayer(multiplier: number): void {
    this.player.currentMoney += this.player.bet * multiplier;
    this.player.totalEarned += this.player.bet * multiplier;
    this.player.totalLost -= this.player.bet * multiplier;
  }

  setGameMode(gameMode: IGameMode): void {
    this.currentGameMode = gameMode;
  }

  ngOnDestroy(): void {
    this.updatePlayer();
  }

  private updatePlayer(): void {
    this.authService.updatePlayer(this.player).subscribe();
  }
}
