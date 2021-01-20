import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ErrorService } from 'src/app/shared/error.service';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';

import { BlackjackService } from './blackjack.service';
import { Player } from './objects/player';
import { Table } from './objects/table';

describe('BlackjackService', () => {
  let httpClientSpy: {post: jasmine.Spy};
  let blackjackService: BlackjackService;
  let playerObject: Player;
  const errorService = new ErrorService();

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    blackjackService = new BlackjackService(httpClientSpy as any, errorService);
    playerObject = new Player({
      username: 'MichaelScott',
      password: 'password',
      active: false,
      currentMoney: 20,
      totalEarned: 20,
      totalLost: 10000
    });
  });

  describe('startGame()', () => {
    it('should return expected table', () => {
      const casinoTable = new Table();
      const betAmount = 50;
      casinoTable.player = playerObject;
      casinoTable.player.currentBet = betAmount;

      httpClientSpy.post.and.returnValue(of(casinoTable));

      blackjackService.startGame(playerObject, betAmount).subscribe(
        (table: Table) => {
          expect(table.player.currentBet).toBe(betAmount);
          expect(table.player.username).toBe(playerObject.username);
         },
        fail
      );

      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });

    it('should handle errors when thrown', () => {
      const httpError = new HttpErrorResponse({
        status: 400,
        error: 'testing is fun'
      });

      httpClientSpy.post.and.returnValue(throwError(httpError));

      blackjackService.startGame(playerObject, 50).subscribe(
        (table: Table) => fail('expected an error, not heroes'),
        (err: HttpTrackerError) => {
          console.log({err});
          expect(err.errorCode).toBe(httpError.status);
          expect(err.message).toContain(httpError.error);
        }
      );

      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });
  });

  describe('dealCardToPlayer()', () => {
    it('should return expected table', () => {
      const casinoTable = new Table();
      casinoTable.player = playerObject;

      httpClientSpy.post.and.returnValue(of(casinoTable));

      blackjackService.dealCardToPlayer(casinoTable).subscribe(
        (table: Table) => {
          expect(table.player.username).toBe(playerObject.username);
         },
        fail
      );

      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });

    it('should handle errors when thrown', () => {
      const casinoTable = new Table();
      const httpError = new HttpErrorResponse({
        status: 400,
        error: 'testing is fun'
      });

      httpClientSpy.post.and.returnValue(throwError(httpError));

      blackjackService.dealCardToPlayer(casinoTable).subscribe(
        (table: Table) => fail('expected an error, not heroes'),
        (err: HttpTrackerError) => {
          console.log({err});
          expect(err.errorCode).toBe(httpError.status);
          expect(err.message).toContain(httpError.error);
        }
      );

      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });
  });

  describe('finishGame()', () => {
    it('should return expected table', () => {
      const casinoTable = new Table();
      casinoTable.player = playerObject;

      httpClientSpy.post.and.returnValue(of(casinoTable));

      blackjackService.finishGame(casinoTable).subscribe(
        (table: Table) => {
          expect(table.player.username).toBe(playerObject.username);
         },
        fail
      );

      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });

    it('should handle errors when thrown', () => {
      const casinoTable = new Table();
      const httpError = new HttpErrorResponse({
        status: 400,
        error: 'testing is fun'
      });

      httpClientSpy.post.and.returnValue(throwError(httpError));

      blackjackService.finishGame(casinoTable).subscribe(
        (table: Table) => fail('expected an error, not heroes'),
        (err: HttpTrackerError) => {
          console.log({err});
          expect(err.errorCode).toBe(httpError.status);
          expect(err.message).toContain(httpError.error);
        }
      );

      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });
  });

});
