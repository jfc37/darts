import { TestBed } from '@angular/core/testing';

import { TeamGolfGameService } from './team-golf-game.service';

describe('TeamGolfGameService', () => {
  let service: TeamGolfGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamGolfGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
