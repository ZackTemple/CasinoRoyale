import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpTrackerError } from './http-tracker-error';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  handleHttpError(err: HttpErrorResponse): Observable<HttpTrackerError> {
    const httpRetrievalError = new HttpTrackerError();
    httpRetrievalError.errorCode = err.status;
    httpRetrievalError.message = err.error;
    return throwError(httpRetrievalError);
  }
}
