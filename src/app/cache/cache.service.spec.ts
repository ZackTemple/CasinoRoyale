import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('put()', () => {
    it('should take a url and response and add to requests', () => {
      const url = 'some/url';
      const res = new HttpResponse();

      const spy = spyOn(service, 'put').and.callThrough();
      service.put(url, res);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('get()', () => {
    it('should take a url and response and add to requests', () => {
      const url = 'some/url';

      const spy = spyOn(service, 'get').and.callThrough();
      service.get(url);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('invalidateUrl()', () => {
    it('should take a url and invalidate remove it from the cache', () => {
      const url = 'some/url';

      const spy = spyOn(service, 'invalidateUrl').and.callThrough();
      service.invalidateUrl(url);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('invalidateCache()', () => {
    it('should wipe out the entire cache', () => {
      const spy = spyOn(service, 'invalidateCache').and.callThrough();
      service.invalidateCache();

      expect(spy).toHaveBeenCalled();
    });
  });
});
