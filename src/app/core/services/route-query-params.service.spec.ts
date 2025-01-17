import { TestBed } from '@angular/core/testing';

import { RouteQueryParamsService } from './route-query-params.service';

describe('RouteQueryParamsService', () => {
  let service: RouteQueryParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteQueryParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
