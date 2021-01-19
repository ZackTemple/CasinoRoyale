import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineGamingComponent } from './online-gaming.component';

describe('OnlineGamingComponent', () => {
  let component: OnlineGamingComponent;
  let fixture: ComponentFixture<OnlineGamingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineGamingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineGamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
