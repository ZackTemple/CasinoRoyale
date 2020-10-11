import { TestBed } from '@angular/core/testing';
import { ICard } from '../../../interfaces/cards';
import { Deck } from './deck';

fdescribe('Deck', () => {
  let deck: Deck;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    deck = TestBed.inject(Deck);
  });

  describe('getDeck() method', () => {
    it('should return a created card deck', () => {
      // Arrange
      let cards: ICard[];

      // Act
      cards = deck.getDeck();

      // Assert
      expect(deck.cards.length).toBe(52);
    });
  });
});
