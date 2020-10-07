import { TestBed } from '@angular/core/testing';

import { CardDeckService } from './card-deck.service';
import { ICard, ICardBlackjack } from '../interfaces/cards';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';

fdescribe('CardDeckService', () => {
  let service: CardDeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardDeckService);
  });

  describe('getDeck() method', () => {
    it('should return a created card deck', () => {
      // Arrange
      let deck: ICard[];

      // Act
      deck = service.getDeck();

      // Assert
      expect(deck.length).toBe(52);
    });
  });

  describe('appendWeights(deck) method', () => {
    let deck: ICard[];

    beforeEach(() => {
      deck = service.getDeck();
    });

    it('should return a new deck with weights', () => {
      // Arrange
      let blackjackDeck: ICardBlackjack[];

      // Act
      blackjackDeck = service.appendWeightsForBlackjack(deck);
      const firstCard = blackjackDeck[1];
      const typeOfWeight = typeof firstCard.weight;


      // Assert
      expect(typeOfWeight).toBe('number');
    });
  });

  describe ('getWeight(card) method', () => {
    let card: ICard;
    let blackjackCard: ICardBlackjack;

    it('should return J, Q, and K cards with weight 10', () => {
      card = {value: 'K', suit: 'hearts'};

      blackjackCard = service.getWeight(card);

      expect(blackjackCard.weight).toBe(10);
    });

    it('should return Aces with weight 11', () => {
      card = {value: 'A', suit: 'spades'};

      blackjackCard = service.getWeight(card);

      expect(blackjackCard.weight).toBe(11);
    });

    it('should return the value of the card as weight if not J, Q, K, or A', () => {
      card = {value: '5', suit: 'clovers'};

      blackjackCard = service.getWeight(card);

      expect(blackjackCard.weight).toBe(5);
    });
  });

  describe('shuffleDeck(deck) method', () => {
    let deck: ICard[];
    it('should return a shuffled deck', () => {
      deck = service.getDeck();
      let shuffledDeck: ICard[];

      shuffledDeck = service.shuffleDeck(deck);

      expect(shuffledDeck.length).toBe(52);
    });
  });
});
