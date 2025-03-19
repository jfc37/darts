import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSelectionContainer } from './game-selection.container';

describe('GameSelectionContainer', () => {
  let component: GameSelectionContainer;
  let fixture: ComponentFixture<GameSelectionContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSelectionContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSelectionContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
