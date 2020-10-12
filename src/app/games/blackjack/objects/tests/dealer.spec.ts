import { Dealer } from '../dealer';
import { Player } from '../player';
import { Table } from '../table';

fdescribe('Dealer Object', () => {
  let dealer: Dealer;
  let player: Player;
  let table: Table;

  beforeEach(() => {
    dealer = new Dealer();
    player = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      _id: 'id-here'
    });
  });

  describe('subtractBetFromPlayerWallet(player) method', () => {
    let bet: number;

    it('should subtract the player bet from the players currentMoney', () => {
      const money = player.currentMoney;
      player.bet = bet = 5;

      dealer.subtractBetFromPlayerWallet(player);

      expect(player.currentMoney).toBe(money - bet);
    });
  });

  describe('shuffleDeck() method', () => {
    it('should return a shuffled deck', () => {
      dealer.shuffleDeck();

      expect(dealer.deck.cards.length).toBe(52);
    });
  });

  describe('dealCardsToStartGame(players)', () => {
    it('should deal cards to players and dealer', () => {
      dealer.dealCardsToStartGame([dealer, player]);

      expect(player.cards.length).toBe(2);
    });
  });

  describe('dealCardToPlayer(player, numOfCards) method', () => {
    let numOfCards: number;

    it('should give the player numOfCards from the deck', () => {
      numOfCards = 5;

      dealer.dealCardToPlayer(player, numOfCards);

      expect(player.cards.length).toBe(5);
    });

    it('should drop numOfCards from the deck', () => {
      dealer.resetDeck();
      numOfCards = 5;

      dealer.dealCardToPlayer(player, numOfCards);

      expect(dealer.deck.cards.length).toBe(52 - numOfCards);
    });
  });

  describe('resetDeck() method', () => {
    it('should return a new deck', () => {
      dealer.shuffleDeck();
      dealer.resetDeck();

      // deck created in ascending order, so two should be the first value
      expect(dealer.deck.cards[0].value).toBe('2');
    });
  });

  describe('awardPlayer(player)', () => {
    let moneyBeforeAdding: number;

    it('should add double the players bet to the players wallet if player score is less than 21', () => {
      player.score = 18;
      moneyBeforeAdding = player.currentMoney;
      player.bet = 50;
      dealer.awardPlayer(player);

      expect(player.currentMoney).toBe(moneyBeforeAdding + 2 * player.bet);
    });

    it('should add thrice the players bet to the players wallet if player score is 21', () => {
      player.score = 21;
      moneyBeforeAdding = player.currentMoney;
      player.bet = 50;
      dealer.awardPlayer(player);

      expect(player.currentMoney).toBe(moneyBeforeAdding + 3 * player.bet);
    });
  });

  describe('returnPlayerBet(player)', () => {
    let moneyBeforeAdding: number;

    it('should return players bet to his/her wallet (happens when a tie occurs)', () => {
      moneyBeforeAdding = player.currentMoney;
      player.bet = 50;
      dealer.returnPlayerBet(player);

      expect(player.currentMoney).toBe(moneyBeforeAdding + player.bet);
    });
  });

  describe('collectOldCards(table)', () => {
    it('should return players bet to his/her wallet (happens when a tie occurs)', () => {
      // Arrange and add cards to player and dealer hands
      table = new Table([dealer, player]);
      dealer.dealCardsToStartGame(table.players);

      // Act
      dealer.collectOldCards(table);

      // Assert that the players hand is now empty
      expect(player.cards).toEqual([]);
    });
  });


// ----- Private Methods -----
  // describe('determineNumberOfCards(player) method', () => {
  //   it('should return 2 if given a Player', () => {
  //     const numOfCards = dealer.determineNumberOfCards(player);

  //     expect(numOfCards).toBe(2);
  //   });

  //   it('should return 1 if guven a Dealer', () => {
  //     const numOfCards = dealer.determineNumberOfCards(dealer);

  //     expect(numOfCards).toBe(1);
  //   });
  // });
});
