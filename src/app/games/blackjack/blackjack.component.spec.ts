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
      _id: 'id-here'
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

      // Act
      component.clickHit();

      expect(component.player.cards.length).toBe(3);
    });
  });
});
