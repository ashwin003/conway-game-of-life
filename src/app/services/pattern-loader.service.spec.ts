import { TestBed } from '@angular/core/testing';

import { PatternLoaderService } from './pattern-loader.service';

describe('PatternLoaderService', () => {
  let service: PatternLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatternLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
