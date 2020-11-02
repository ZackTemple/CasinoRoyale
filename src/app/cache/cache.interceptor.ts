import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CacheService } from './cache.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: CacheService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // pass along any non-cacheable requests and invalidates cache
    if (request.method !== 'GET') {
      console.log(`Invalidating cache: ${request.method} ${request.url}`);
      this.cacheService.invalidateCache();
      return next.handle(request);
    }

    // attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> = this.cacheService.get(request.url);

    // return valid cached response
    if (cachedResponse) {
      console.log(`Returning a cached response: ${cachedResponse.url}`);
      console.log(cachedResponse);
      return of(cachedResponse);
    }

    // send request to server and add response to cache
    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            console.log(`Adding items to cache: ${request.url}`);
            this.cacheService.put(request.url, event);
          }
        }
      )
    );
  }
}
