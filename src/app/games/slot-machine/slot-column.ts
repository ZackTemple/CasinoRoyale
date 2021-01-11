import { ImagesArray, SlotMachineImage } from './slots-images';
import * as _ from 'lodash';


export class SlotColumn {
  middleIndex: number;

  topImage: string;
  middleImage: string;
  bottomImage: string;

  columnImages: SlotMachineImage[];

  get topIndex(): number {
    return this.middleIndex === ImagesArray.length - 1 ? 0 : this.middleIndex + 1;
  }

  get bottomIndex(): number {
    return this.middleIndex === 0 ? ImagesArray.length - 1 : this.middleIndex - 1;
  }

  private static generateRandomIndex(): number {
    return Math.floor(Math.random() * ImagesArray.length);
  }

  public constructor() {
    this.columnImages = _.shuffle(SlotMachineImage.imageFactory());
    this.middleIndex = SlotColumn.generateRandomIndex();
    this.updateSlotImages();
  }

  spinWheel(): void {
    this.middleIndex = this.middleIndex === ImagesArray.length - 1 ? 0 : this.middleIndex + 1;
    this.updateSlotImages();
  }

  private updateSlotImages(): void {
    this.topImage = this.columnImages[this.topIndex].imageUrl;
    this.middleImage = this.columnImages[this.middleIndex].imageUrl;
    this.bottomImage = this.columnImages[this.bottomIndex].imageUrl;
  }
}
