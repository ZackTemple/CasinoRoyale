import { ImagesArray } from './slots-images';
import * as _ from 'lodash';
import { IGameMode } from './igame-mode';
import { SlotColumn } from './slot-column';


export class SlotMachine {

  leftSlot: SlotColumn;
  centerSlot: SlotColumn;
  rightSlot: SlotColumn;

  public constructor() {
    this.initializeSlotColumns();
  }

  private initializeSlotColumns(): void {
    [this.leftSlot, this.centerSlot, this.rightSlot] = _.times(3, () => new SlotColumn());
  }

  startSpin(speed: number): any[] {
    return [
      setInterval(() => { this.leftSlot.spinWheel(); }, speed),
      setInterval(() => { this.centerSlot.spinWheel(); }, speed),
      setInterval(() => { this.rightSlot.spinWheel(); }, speed)
    ];
  }

  findNumberOfRowsWon(): number {
    const winnersArray = this.checkRowWinners();
    return winnersArray.filter(bool => bool).length;
  }

  private checkRowWinners(): boolean[] {
    return [
      this.leftSlot.topImage === this.centerSlot.topImage && this.leftSlot.topImage === this.rightSlot.topImage,
      this.leftSlot.middleImage === this.centerSlot.middleImage && this.leftSlot.middleImage === this.rightSlot.middleImage,
      this.leftSlot.bottomImage === this.centerSlot.bottomImage && this.leftSlot.bottomImage === this.rightSlot.bottomImage
    ];
  }
}
