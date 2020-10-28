import { componentFactoryName } from '@angular/compiler';
import { of } from 'rxjs';
import { BlackjackComponent } from './blackjack.component';
import { Dealer } from './objects/dealer';
import { Player } from './objects/player';
import { Table } from './objects/table';

fdescribe('BlackjackComponent', () => {
  let component: BlackjackComponent;
  let mockAuthService;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer']);
    component = new BlackjackComponent(mockAuthService);

    component.dealer = new Dealer();
    component.player = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      id: 'id-here'
    });
    component.table = new Table([component.player, component.dealer]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClickPlaceBet() method', () => {
    it('should set betLockedIn to false if player.bet < 0 or player.bet > player.currentMoney', () => {
      component.player.bet = -5;

      component.onClickPlaceBet();

      expect(component.betLockedIn).toBe(false);
    });

    it('should reset prior game attributes and start game if 0 < player.bet <= player.currentMoney', () => {
      component.player.bet = 5;

      component.onClickPlaceBet();

      expect(component.betLockedIn).toBe(true);
    });
  });

  describe('setupNewGame()', () => {
    it('should reset game attributes, gather cards from players from prior round, and reset the deck', () => {
      // fake a result from last game
      component.tie = true;

      component.setupNewGame();

      expect(component.tie).toBe(false);
    });
  });

  describe('setupNewGame()', () => {
    it('should reset game attributes, gather cards from players from prior round, and reset the deck', () => {
      // fake a result from last game
      component.tie = true;

      component.setupNewGame();

      expect(component.tie).toBe(false);
    });
  });

  describe('startGame()', () => {
    it('should subtract player bet from wallet, shuffle deck, and deal cards to players', () => {
      component.player.bet = 5;

      component.startGame();

      expect(component.player.cards.length).toBe(2);
    });
  });

  describe('clickHit()', () => {
    it('should add a card to the players cards', () => {
      // Arrange
      component.player.bet = 5;
      component.startGame();
      component.player.cards = [
        {suit: 'Hearts', value: '5', weight: 5},
        {suit: 'Spades', value: '2', weight: 2},
      ];

      // Act
      component.clickHit();

      expect(component.player.cards.length).toBe(3);
    });
  });

  describe('playerBustQ()', () => {
    it('should end the game if the player score goes over 21', () => {
      // Arrange
      mockAuthService.updatePlayer.and.returnValue(of(true));
      component.player.cards = [
        {suit: 'Clovers', value: 'K', weight: 10},
        {suit: 'Hearts', value: 'K', weight: 10},
        {suit: 'Spades', value: 'K', weight: 10},
      ];

      // Act
      component.playerBustQ();

      expect(component.winner).toBe(component.dealer);
    });
  });

  describe('getScore(hand)', () => {
    it('should return the score of a player or a dealer', () => {
      mockAuthService.updatePlayer.and.returnValue(of(true));

      // Arrange
      component.player.cards = [
        {suit: 'Clovers', value: 'K', weight: 10},
        {suit: 'Hearts', value: '5', weight: 5},
        {suit: 'Spades', value: '2', weight: 2},
      ];

      // Act
      component.getScore(component.player);

      expect(component.player.score).toBe(17);
    });
  });

  describe('endGameFromUserBust()', () => {
    it('should set the winner to dealer and end the game', () => {
      mockAuthService.updatePlayer.and.returnValue(of(true));
      // Act
      component.endGameFromUserBust();

      expect(component.winner).toBe(component.dealer);
      expect(component.bust).toBe(true);
    });
  });

  describe('playDealersTurn()', () => {
    it('should allow the dealer to hit until his/her cards until dealer.score > 17 or dealer.score > player.score', () => {
      // Arrange
      component.player.score = 18;
      component.dealer.cards = [
        {suit: 'Clovers', value: 'K', weight: 10}
      ];
      const beforeDealersTurn = component.dealer.cards.length;

      // Assert
      component.playDealersTurn();
      const afterDealersTurn = component.dealer.cards.length;

      expect(beforeDealersTurn < afterDealersTurn).toBe(true);
    });
  });

  describe('getGameResults()', () => {
    it('should set player to the winner if the player has a higher score or if the dealer busts', () => {
      component.dealer.score = 22;

      component.getGameResults();

      expect(component.winner).toBe(component.player);
    });

    it('should set the dealer to the winner if dealer has higher score than player and did not busted', () => {
      component.dealer.score = 21;
      component.player.score = 20;

      component.getGameResults();

      expect(component.winner).toBe(component.dealer);
    });

    it('should set the tie attribute to true if there is a tie', () => {
      component.dealer.score = component.player.score = 20;

      component.getGameResults();

      expect(component.tie).toBe(true);
    });
  });



  describe('actOnGameResults()', () => {

    beforeEach(() => {
      component.player.bet = 5;
      component.player.cards = [
        {suit: 'Clovers', value: 'K', weight: 10},
        {suit: 'Hearts', value: '5', weight: 5},
        {suit: 'Spades', value: '5', weight: 5},
      ];
    });

    it('should award the player by adding money to his/her wallet if the player wins', () => {
      component.winner = component.player;
      const beforeAwardingPlayer = component.player.currentMoney;

      component.actOnGameResults();

      expect(beforeAwardingPlayer < component.player.currentMoney).toBe(true);
    });

    it('should return the initial bet to the player if there is a tie', () => {
      component.tie = true;
      const beforeAwardingPlayer = component.player.currentMoney;

      component.actOnGameResults();

      expect(component.player.currentMoney).toBe(beforeAwardingPlayer + component.player.bet);
    });

    it('should decrease the players totalLost if the players loses', () => {
      component.winner = component.dealer;
      const beforeAwardingPlayer = component.player.totalLost;

      component.actOnGameResults();

      expect(component.player.totalLost).toBe(beforeAwardingPlayer + component.player.bet);
    });
  });

  describe('updateLocalStorage()', () => {
    it('should store the Player information in local storage', () => {
      mockAuthService.updatePlayer.and.returnValue(of(true));
      localStorage.removeItem('Authorization');

      // Act
      component.updatePlayer();
      const localInfo = localStorage.getItem('Authorization');

      expect(localInfo).toBeTruthy();
    });
  });
});
