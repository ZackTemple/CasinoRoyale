import { ICard } from '../../../../interfaces/cards';
import { Deck } from '../deck';

describe('Deck', () => {
  let deck: Deck;

  describe('getDeck() method', () => {
    it('should return a created card deck', () => {
      // Arrange
      deck = new Deck();
      let cards: ICard[];

      // Act
      cards = deck.getDeck();

      // Assert
      expect(deck.cards.length).toBe(52);
    });
  });

  // -------Private method tests-------


  // describe ('getWeight method', () => {
  //   let weight: number;

  //   beforeEach(() => {
  //     deck = new Deck();
  //   });

  //   it('should return J, Q, and K cards with weight 10', () => {
  //     weight = deck.getWeight('Clovers', 'K');

  //     expect(weight).toBe(10);
  //   });

  //   it('should return Aces with weight 11', () => {
  //     weight = deck.getWeight('Hearts', 'A');

  //     expect(weight).toBe(11);
  //   });

  //   it('should return the value of the card as weight if not J, Q, K, or A', () => {
  //     weight = deck.getWeight('Spades', '5');

  //     expect(weight).toBe(5);
  //   });
  // });

});
