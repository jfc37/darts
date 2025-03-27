import { TestBed } from '@angular/core/testing';

import { GolfGameService } from './golf-game.service';

describe('GolfGameService', () => {
  let service: GolfGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GolfGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
