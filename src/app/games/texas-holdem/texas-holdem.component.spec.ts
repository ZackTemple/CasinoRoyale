import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TexasHoldemComponent } from './texas-holdem.component';

describe('TexasHoldemComponent', () => {
  let component: TexasHoldemComponent;
  let fixture: ComponentFixture<TexasHoldemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TexasHoldemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TexasHoldemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
