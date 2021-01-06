import { SlotMachineComponent } from './slot-machine.component';

export const ImagesArray = [
  '../../../assets/images/slots/cherries.png',
  '../../../assets/images/slots/seven.png',
  '../../../assets/images/slots/bell.png',
  '../../../assets/images/slots/bar.png',
  '../../../assets/images/slots/watermelon.png',
  '../../../assets/images/slots/diamond.png',
  '../../../assets/images/slots/lemon.png',
  '../../../assets/images/slots/bananas.png',
  '../../../assets/images/slots/triple-bar.png',
  '../../../assets/images/slots/slot-machine.png',
  '../../../assets/images/slots/big-win.png',
  '../../../assets/images/slots/crown.png',
];

export class SlotMachineImage {
  imageUrl: string;
  label: string;
  id: number;

  constructor(label: string, url: string, id: number) {
    const newClass: SlotMachineImage =  {
      label,
      imageUrl: url,
      id
    };
    Object.assign(this, newClass);
  }

  public static imageFactory(): SlotMachineImage[] {
    return [
      new SlotMachineImage('Bananas', '../../../assets/images/slots/bananas.png', 1),
      new SlotMachineImage('Bar', '../../../assets/images/slots/bar.png', 2),
      new SlotMachineImage('Bell', '../../../assets/images/slots/bell.png', 3),
      new SlotMachineImage('BigWin', '../../../assets/images/slots/big-win.png', 4),
      new SlotMachineImage('Cherries', '../../../assets/images/slots/cherries.png', 5),
      new SlotMachineImage('Crown', '../../../assets/images/slots/crown.png', 6),
      new SlotMachineImage('Diamond', '../../../assets/images/slots/diamond.png', 7),
      new SlotMachineImage('Lemon', '../../../assets/images/slots/lemon.png', 8),
      new SlotMachineImage('Seven', '../../../assets/images/slots/seven.png', 9),
      new SlotMachineImage('SlotMachine', '../../../assets/images/slots/slot-machine.png', 10),
      new SlotMachineImage('TripleBar', '../../../assets/images/slots/triple-bar.png', 11),
      new SlotMachineImage('Watermelon', '../../../assets/images/slots/watermelon.png', 12)
    ];
  }
}
