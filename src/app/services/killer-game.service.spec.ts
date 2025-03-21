import { TestBed } from '@angular/core/testing';

import { KillerGameService } from './killer-game.service';

describe('KillerGameService', () => {
  let service: KillerGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KillerGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
