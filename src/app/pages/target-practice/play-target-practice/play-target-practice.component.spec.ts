import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTargetPracticeComponent } from './play-target-practice.component';

describe('PlayTargetPracticeComponent', () => {
  let component: PlayTargetPracticeComponent;
  let fixture: ComponentFixture<PlayTargetPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayTargetPracticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayTargetPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
