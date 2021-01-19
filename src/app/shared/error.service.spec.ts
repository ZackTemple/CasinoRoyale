import { HttpErrorResponse } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { HttpTrackerError } from './http-tracker-error';

describe('ErrorService', () => {
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    errorService = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(errorService).toBeTruthy();
  });

  describe('handleHttpError()', () => {
    it('should construct an HttpTrackerError and return it through a throw error', waitForAsync(() => {
      const httpError = new HttpErrorResponse({
        status: 404,
        error: 'Testing is fun'
      });

      errorService.handleHttpError(httpError).subscribe(
        () => {
          fail('expected error');
        },
        (err: HttpTrackerError) => {
          expect(err.message).toBe(httpError.error);
          expect(err.errorCode).toBe(httpError.status);
        }
      );
    }));
  });
});
