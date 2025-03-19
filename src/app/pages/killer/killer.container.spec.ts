import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KillerContainer } from './killer.container';

describe('KillerContainer', () => {
  let component: KillerContainer;
  let fixture: ComponentFixture<KillerContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KillerContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KillerContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
