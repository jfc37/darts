import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KillerGameOverComponent } from './killer-game-over.component';

describe('KillerGameOverComponent', () => {
  let component: KillerGameOverComponent;
  let fixture: ComponentFixture<KillerGameOverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KillerGameOverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KillerGameOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
