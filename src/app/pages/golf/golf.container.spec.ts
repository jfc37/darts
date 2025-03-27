import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GolfContainer } from './golf.container';

describe('GolfContainer', () => {
  let component: GolfContainer;
  let fixture: ComponentFixture<GolfContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GolfContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GolfContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
