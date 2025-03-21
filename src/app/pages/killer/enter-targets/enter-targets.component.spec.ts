import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterTargetsComponent } from './enter-targets.component';

describe('EnterTargetsComponent', () => {
  let component: EnterTargetsComponent;
  let fixture: ComponentFixture<EnterTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterTargetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
