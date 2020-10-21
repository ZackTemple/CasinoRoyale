import { Player } from "../player"

fdescribe('Player Object', () => {

  let player: Player;

  it('should set player information', () => {
    player = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      id: 'id-here'
    });

    expect(player.name).toBe('foo');
  });
});
