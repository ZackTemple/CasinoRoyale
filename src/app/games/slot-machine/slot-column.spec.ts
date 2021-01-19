import { SlotColumn } from './slot-column';

describe('SlotColumn', () => {
  let slotColumn: SlotColumn;

  beforeEach(() => {
    slotColumn = new SlotColumn();
  });

  describe('topIndex', () => {
    it('should return the middle index + 1 if the middle index is not equal to slotColumn.columnImages.length - 1', () => {
      slotColumn.middleIndex = 3;
      expect(slotColumn.topIndex).toBe(slotColumn.middleIndex + 1);
    });

    it('should return zero if the middle index is equal to slotColumn.columnImages.length - 1', () => {
      slotColumn.middleIndex = slotColumn.columnImages.length - 1;
      expect(slotColumn.topIndex).toBe(0);
    });
  });

  describe('bottomIndex', () => {
    it('should return the middle index - 1 if the middle index is not equal to zero', () => {
      slotColumn.middleIndex = 3;
      expect(slotColumn.bottomIndex).toBe(slotColumn.middleIndex - 1);
    });

    it('should return slotColumn.columnImages.length - 1 if the middle index is equal to zero', () => {
      slotColumn.middleIndex = 0;
      expect(slotColumn.bottomIndex).toBe(slotColumn.columnImages.length - 1);
    });
  });

  describe('spinWheel', () => {
    it('should increase the middle wheel index and assign new images', () => {
      const indexBeforeSpin = slotColumn.middleIndex;

      slotColumn.spinWheel();
      // accounts for looping around images array
      const expectedIndex = indexBeforeSpin === slotColumn.columnImages.length - 1 ? 0 : indexBeforeSpin + 1;

      expect(slotColumn.middleIndex).toBe(expectedIndex);
    });
  });
});
