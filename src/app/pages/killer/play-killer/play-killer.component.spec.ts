import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayKillerComponent } from './play-killer.component';

describe('PlayKillerComponent', () => {
  let component: PlayKillerComponent;
  let fixture: ComponentFixture<PlayKillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayKillerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayKillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
