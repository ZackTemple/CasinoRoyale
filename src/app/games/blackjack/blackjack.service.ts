import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Table } from './objects/table';

@Injectable({
  providedIn: 'root'
})
export class BlackjackService {

  baseRoute = 'http://localhost:5000/api/blackjack';

  constructor(private httpClient: HttpClient) { }

  startNewGame(table: Table): Observable<Table> {
    const startGameRoute = this.baseRoute.concat('/start-game');
    console.log(table);

    return this.httpClient.post<Table>(startGameRoute, table).pipe(
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  dealCardToPlayer(table: Table): Observable<Table> {
    const route = this.baseRoute.concat('/player/deal-card');

    return this.httpClient.post<Table>(route, table).pipe(
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }
}
