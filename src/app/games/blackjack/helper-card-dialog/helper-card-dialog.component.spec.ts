import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperCardDialogComponent } from './helper-card-dialog.component';

describe('HelperCardDialogComponent', () => {
  let component: HelperCardDialogComponent;
  let fixture: ComponentFixture<HelperCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelperCardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelperCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
