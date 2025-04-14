import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamGolfContainer } from './team-golf.container';

describe('TeamGolfContainer', () => {
  let component: TeamGolfContainer;
  let fixture: ComponentFixture<TeamGolfContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamGolfContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamGolfContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
