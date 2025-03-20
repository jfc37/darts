import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterTeamsComponent } from './enter-teams.component';

describe('EnterTeamsComponent', () => {
  let component: EnterTeamsComponent;
  let fixture: ComponentFixture<EnterTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
