import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';
import { ErrorService } from 'src/app/shared/error.service';
import { Player } from './objects/player';
import { Table } from './objects/table';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlackjackService {

  baseRoute = `${environment.apiBaseUrl}/api/blackjack`;

  constructor(private httpClient: HttpClient, private errorService: ErrorService) { }

  startGame(startingPlayer: Player, proposedBet: number): Observable<Table | HttpTrackerError> {
    const betRoute = this.baseRoute.concat('/start-game');

    return this.httpClient.post<Table>(betRoute, {player: startingPlayer, bet: proposedBet}).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          return this.errorService.handleHttpError(err);
        }
      )
    );
  }

  dealCardToPlayer(table: Table): Observable<Table | HttpTrackerError> {
    const route = this.baseRoute.concat('/player/hit');

    return this.httpClient.post<Table>(route, table).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          return this.errorService.handleHttpError(err);
        }
      )
    );
  }

  finishGame(table: Table): Observable<Table | HttpTrackerError> {
    const finishGameRoute = this.baseRoute.concat('/player/stay');

    return this.httpClient.post<Table>(finishGameRoute, table).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          return this.errorService.handleHttpError(err);
        }
      )
    );
  }
}
