import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGolfComponent } from './play-golf.component';

describe('PlayGolfComponent', () => {
  let component: PlayGolfComponent;
  let fixture: ComponentFixture<PlayGolfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayGolfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayGolfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
