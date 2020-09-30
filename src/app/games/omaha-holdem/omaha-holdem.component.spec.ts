import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmahaHoldemComponent } from './omaha-holdem.component';

describe('OmahaHoldemComponent', () => {
  let component: OmahaHoldemComponent;
  let fixture: ComponentFixture<OmahaHoldemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OmahaHoldemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmahaHoldemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
