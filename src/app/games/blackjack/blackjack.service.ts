import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpTrackerError } from 'src/app/shared/http-tracker-error';
import { ErrorService } from 'src/app/shared/error.service';
import { Player } from './objects/player';
import { Table } from './objects/table';

@Injectable({
  providedIn: 'root'
})
export class BlackjackService {

  baseRoute = 'http://localhost:5000/api/blackjack';

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
    const route = this.baseRoute.concat('/player/deal-card');

    return this.httpClient.post<Table>(route, table).pipe(
      catchError(
        (err: HttpErrorResponse) => this.errorService.handleHttpError(err)
      )
    );
  }
}
