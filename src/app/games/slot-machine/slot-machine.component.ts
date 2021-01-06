import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';
import { Player } from '../blackjack/objects/player';
import { ImagesArray, SlotMachineImage } from './slots-images';
import * as _ from 'lodash';

@Component({
  selector: 'app-slot-machine',
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SlotMachineComponent implements OnInit, OnDestroy {

  constructor(public authService: AuthService) { }

  player: Player;

  leftWheelMiddleIndex: number;
  centerWheelMiddleIndex: number;
  rightWheelMiddleIndex: number;

  leftSlotImages: SlotMachineImage[];
  centerSlotImages: SlotMachineImage[];
  rightSlotImages: SlotMachineImage[];

  leftSlot: any;
  centerSlot: any;
  rightSlot: any;
  intervalCounter = 0;

  winner = false;

  currentGameMode: any;
  gameModes = {
    GODMODE: 'God Mode',
    NORMAL: 'Normal',
    EASY: 'Easy'
  };

  private static findWinMulitplier(rowsWon: number): number {
    const oneRowWinner = 5;
    const twoRowWinner = 20;
    const threeRowWinner = 100;

    return rowsWon === 1 ? oneRowWinner :
      rowsWon === 2 ? twoRowWinner :
      threeRowWinner;
  }

  private static findOuterItemId(images: SlotMachineImage[], index: number, isTopItem: boolean): number {
    const itemIndex = isTopItem ? (index === images.length - 1 ? 0 : index + 1) : (index === 0 ? images.length - 1 : index - 1);
    return images[itemIndex].id;
  }

  private static generateRandomIndex(): number {
    return Math.floor(Math.random() * ImagesArray.length);
  }

  ngOnInit(): void {
    this.currentGameMode = this.gameModes.NORMAL;
    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: Player) => this.player = player,
      (err: HttpTrackerError) => console.log(err)
    );
    this.gatherSlotMachineImages();
    this.setInitialWheelValues();
  }

  private gatherSlotMachineImages(): void {
    [this.leftSlotImages, this.centerSlotImages, this.rightSlotImages] = _.times(3, () => _.shuffle(SlotMachineImage.imageFactory()));
  }

  private setInitialWheelValues(): void {
    [this.leftWheelMiddleIndex, this.centerWheelMiddleIndex, this.rightWheelMiddleIndex] =
      _.times(3, () => SlotMachineComponent.generateRandomIndex());
  }

  validateBet(): void {
    if (this.player.bet <= this.player.currentMoney) {
      this.winner = false;
      this.subtractPlayerBet();
      this.startSpin();
    }
  }

  private subtractPlayerBet(): void {
    this.player.currentMoney -= this.player.bet;
    this.player.totalLost -= this.player.bet;
    this.updatePlayer();
  }

  startSpin(): void {
    const speed = this.getSpeedFromGameMode();
    this.leftSlot = setInterval(() => {
      this.leftWheelMiddleIndex = this.increaseWheelIndexByOne(this.leftWheelMiddleIndex);
    }, speed);

    this.centerSlot = setInterval(() => {
      this.centerWheelMiddleIndex = this.increaseWheelIndexByOne(this.centerWheelMiddleIndex);
    }, speed);

    this.rightSlot = setInterval(() => {
      this.rightWheelMiddleIndex = this.increaseWheelIndexByOne(this.rightWheelMiddleIndex);
    }, speed);

    this.intervalCounter = 3;
  }

  private getSpeedFromGameMode(): number {
    let speed: number;
    switch (this.currentGameMode) {
      case this.gameModes.EASY:
        speed = 400;
        break;
      case this.gameModes.NORMAL:
        speed = 50;
        break;
      case this.gameModes.GODMODE:
        speed = 5;
        break;
    }
    return speed;
  }

  private increaseWheelIndexByOne(index: number): number {
    return index === ImagesArray.length - 1 ? 0 : index + 1;
  }

  stopSpin(): void {
    if (this.intervalCounter === 3) {
      clearInterval(this.leftSlot);
    }
    else if (this.intervalCounter === 2) {
      clearInterval(this.centerSlot);
    }
    else {
      clearInterval(this.rightSlot);
    }
    this.intervalCounter--;

    if (this.intervalCounter === 0) {
      this.checkForWinner();
    }
  }

  checkForWinner(): void {
    const winnersArray = this.checkRowWinners();
    const numOfRowsWon = winnersArray.filter(bool => bool).length;

    if (numOfRowsWon > 0) {
      this.winner = true;
      const winMulitplier = SlotMachineComponent.findWinMulitplier(numOfRowsWon);
      this.awardPlayer(winMulitplier);
    }
  }

  private checkRowWinners(): boolean[] {
    const topLeftId = SlotMachineComponent.findOuterItemId(this.leftSlotImages, this.leftWheelMiddleIndex, true);
    const topCenterId = SlotMachineComponent.findOuterItemId(this.centerSlotImages, this.centerWheelMiddleIndex, true);
    const topRightId = SlotMachineComponent.findOuterItemId(this.rightSlotImages, this.rightWheelMiddleIndex, true);

    const bottomLeftId = SlotMachineComponent.findOuterItemId(this.leftSlotImages, this.leftWheelMiddleIndex, false);
    const bottomCenterId = SlotMachineComponent.findOuterItemId(this.centerSlotImages, this.centerWheelMiddleIndex, false);
    const bottomRightId = SlotMachineComponent.findOuterItemId(this.rightSlotImages, this.rightWheelMiddleIndex, false);

    return [
      topLeftId === topCenterId && topLeftId === topRightId,
      this.checkCenterRowWinner(),
      bottomLeftId === bottomCenterId && bottomLeftId === bottomRightId
    ];
  }

  private checkCenterRowWinner(): boolean {
    return this.leftSlotImages[this.leftWheelMiddleIndex].id === this.centerSlotImages[this.centerWheelMiddleIndex].id
      && this.leftSlotImages[this.leftWheelMiddleIndex].id === this.rightSlotImages[this.rightWheelMiddleIndex].id;
  }

  private awardPlayer(multiplier: number): void {
    this.player.currentMoney += this.player.bet * multiplier;
    this.player.totalEarned += this.player.bet * multiplier;
    this.player.totalLost -= this.player.bet * multiplier;
  }

  setGameMode(gameMode: string): void {
    this.currentGameMode = gameMode;
  }

  ngOnDestroy(): void {
    this.updatePlayer();
  }

  private updatePlayer(): void {
    this.authService.updatePlayer(this.player).subscribe();
  }

}
