import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetPracticeContainer } from './target-practice.container';

describe('TargetPracticeContainer', () => {
  let component: TargetPracticeContainer;
  let fixture: ComponentFixture<TargetPracticeContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetPracticeContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetPracticeContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
