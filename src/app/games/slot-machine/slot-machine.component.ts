import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';
import { Player } from '../blackjack/objects/player';
import { IGameMode } from './igame-mode';
import { SlotMachine } from './slot-machine';
import * as _ from 'lodash';
import { BreakpointSizesArray, numOfLightsForTopBottom, numOfLightsForSides, BreakpointsWidthSizes } from './breakpoints';
import { stat } from 'fs';

@Component({
  selector: 'app-slot-machine',
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SlotMachineComponent implements OnInit, OnDestroy {

  topBottomLightsArray: number[];
  sidesLightsArray: number[];
  isDesktopView: boolean;
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

  public constructor(public authService: AuthService, private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.currentGameMode = this.gameModes.NORMAL;
    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: Player) => {
        this.player = player;
        this.player.currentBet = 0;
      },
      (err: HttpTrackerError) => console.log(err)
    );
    this.slotMachine = new SlotMachine();

    this.observeWindowSize();
  }

  observeWindowSize(): void {
    this.breakpointObserver.observe(BreakpointSizesArray)
      .subscribe( (state: BreakpointState) => {
      this.topBottomLightsArray = _.range(numOfLightsForTopBottom(state));
      this.sidesLightsArray = _.range(numOfLightsForSides(state));
      this.isDesktopView = state.breakpoints[BreakpointsWidthSizes.XSmall.widthStr];
    });
  }

  increasePlayerBet(betAmount: number): void {
    this.player.currentBet += betAmount;
  }

  resetPlayerBet(): void {
    this.player.currentBet = 0;
  }

  validateBet(): void {
    if (this.player.currentBet <= this.player.currentMoney) {
      this.winner = false;
      this.subtractPlayerBet();
      this.intervalQueue = this.slotMachine.startSpin(this.currentGameMode.speed);
    }
  }

  private subtractPlayerBet(): void {
    this.player.currentMoney -= this.player.currentBet;
    this.player.totalLost += this.player.currentBet;
    this.updatePlayer();
  }

  stopSpin(): void {
    const columnToStop = this.intervalQueue.shift();
    clearInterval(columnToStop);
    if (this.intervalQueue.length === 0) {
      this.checkForWinner();
      this.resetPlayerBet();
    }
  }

  checkForWinner(): void {
    const numOfRowsWon = this.slotMachine.findNumberOfRowsWon();
    this.awardPlayer(numOfRowsWon);
    this.winner = numOfRowsWon > 0;
  }

  // TODO: alter payouts
  private awardPlayer(numOfRowsWon: number): void {
    this.player.currentMoney += this.payoutEquation(numOfRowsWon);
    this.player.totalEarned += this.payoutEquation(numOfRowsWon);
    this.player.totalLost -= this.player.currentBet;
  }

  // This can be set to whatever, but this will allow great payouts at high speeds, and lower payouts for lower speeds
  payoutEquation(numOfRowsWon: number): number {
    return this.player.currentBet * (100 / this.currentGameMode.speed) * numOfRowsWon;
  }

  setGameMode(gameMode: IGameMode): void {
    this.currentGameMode = gameMode;
  }

  ngOnDestroy(): void {
    this.updatePlayer();
  }

  updatePlayer(): void {
    this.authService.updatePlayer(this.player).subscribe();
  }
}
