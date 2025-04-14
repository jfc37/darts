import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTeamGolfComponent } from './play-team-golf.component';

describe('PlayTeamGolfComponent', () => {
  let component: PlayTeamGolfComponent;
  let fixture: ComponentFixture<PlayTeamGolfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayTeamGolfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayTeamGolfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
