import { TestBed } from '@angular/core/testing';

import { TargetPracticeGameService } from './target-practice-game.service';

describe('TargetPracticeGameService', () => {
  let service: TargetPracticeGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetPracticeGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
