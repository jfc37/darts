import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetPracticeScoreCardComponent } from './target-practice-score-card.component';

describe('TargetPracticeScoreCardComponent', () => {
  let component: TargetPracticeScoreCardComponent;
  let fixture: ComponentFixture<TargetPracticeScoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetPracticeScoreCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetPracticeScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
