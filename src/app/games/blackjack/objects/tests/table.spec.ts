import { IPlayer } from 'src/app/interfaces/player';
import { Player } from '../player';
import { Table } from '../table';

describe('Table Object', () => {
  let table: Table;
  let mockPlayer: Player;

  beforeEach(() => {
    table = new Table([]);
  });

  it('should add a new player', () => {
    // Arrange
    const tableLength = table.players.length;
    mockPlayer = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      id: 'id-here'
    });

    // Act
    table.addNewPlayer(mockPlayer);

    // Assert
    expect(table.players.length).toBe(tableLength + 1);
  });

  it('should remove a player', () => {
    // Arrange
    mockPlayer = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      id: 'id-here'
    });
    table.addNewPlayer(mockPlayer);
    const tableLength = table.players.length;

    // Act
    table.removePlayer(mockPlayer);

    // Assert
    expect(table.players.length).toBe(tableLength - 1);
  });

});
