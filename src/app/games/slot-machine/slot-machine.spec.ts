import { fakeAsync, tick } from '@angular/core/testing';
import { SlotMachine } from './slot-machine';

describe('SlotMachine', () => {
  let slotMachine: SlotMachine;

  beforeEach(() => {
    slotMachine = new SlotMachine();
    slotMachine.leftSlot.middleIndex = 1;
    slotMachine.centerSlot.middleIndex = 1;
    slotMachine.rightSlot.middleIndex = 1;
  });

  describe('startSpin()', () => {
    // could use spyOn() here, but no need. Just test the side effects.
    it('should increase the column indices by 1 at whatever speed it is given. Function returns a list of iintervals.', fakeAsync(() => {
      const speed = 50;
      const indexBeforeSpin = slotMachine.leftSlot.middleIndex;

      const intervalQueue = slotMachine.startSpin(speed);

      expect(slotMachine.leftSlot.middleIndex).toBe(indexBeforeSpin);
      tick(25);
      expect(slotMachine.leftSlot.middleIndex).toBe(indexBeforeSpin);
      tick(25);
      expect(slotMachine.leftSlot.middleIndex).toBe(indexBeforeSpin + 1);

      // call the stopSpin function three times to stop the setInterval calls
      intervalQueue.forEach(int => {
        clearInterval(int);
      });
    }));
  });

  describe('findNumberOfRowsWon', () => {

    it('should return 1 if only one row has the same images on the slot machine' , () => {
      slotMachine.leftSlot.topImage = '/bell.jpg';
      slotMachine.centerSlot.topImage = '/cherries.jpg';
      slotMachine.rightSlot.topImage = '/diamond.jpg';

      slotMachine.leftSlot.middleImage = '/cherries.jpg';
      slotMachine.centerSlot.middleImage = '/cherries.jpg';
      slotMachine.rightSlot.middleImage = '/cherries.jpg';

      slotMachine.leftSlot.bottomImage = '/cherries.jpg';
      slotMachine.centerSlot.bottomImage = '/bananas.jpg';
      slotMachine.rightSlot.bottomImage = '/cherries.jpg';

      const numOfRowsWon = slotMachine.findNumberOfRowsWon();

      expect(numOfRowsWon).toBe(1);
    });

    it('should return 2 if two rows are winners on the slot machine' , () => {
      slotMachine.leftSlot.topImage = '/bell.jpg';
      slotMachine.centerSlot.topImage = '/cherries.jpg';
      slotMachine.rightSlot.topImage = '/diamond.jpg';

      slotMachine.leftSlot.middleImage = '/diamond.jpg';
      slotMachine.centerSlot.middleImage = '/diamond.jpg';
      slotMachine.rightSlot.middleImage = '/diamond.jpg';

      slotMachine.leftSlot.bottomImage = '/bananas.jpg';
      slotMachine.centerSlot.bottomImage = '/bananas.jpg';
      slotMachine.rightSlot.bottomImage = '/bananas.jpg';

      const numOfRowsWon = slotMachine.findNumberOfRowsWon();

      expect(numOfRowsWon).toBe(2);
    });

    it('should return 3 if all three rows are winners on the slot machine' , () => {
      slotMachine.leftSlot.topImage = '/bell.jpg';
      slotMachine.centerSlot.topImage = '/bell.jpg';
      slotMachine.rightSlot.topImage = '/bell.jpg';

      slotMachine.leftSlot.middleImage = '/diamond.jpg';
      slotMachine.centerSlot.middleImage = '/diamond.jpg';
      slotMachine.rightSlot.middleImage = '/diamond.jpg';

      slotMachine.leftSlot.bottomImage = '/bananas.jpg';
      slotMachine.centerSlot.bottomImage = '/bananas.jpg';
      slotMachine.rightSlot.bottomImage = '/bananas.jpg';

      const numOfRowsWon = slotMachine.findNumberOfRowsWon();

      expect(numOfRowsWon).toBe(3);
    });
  });

});
