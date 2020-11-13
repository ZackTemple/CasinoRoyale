import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedSignInDialogComponent } from './failed-sign-in-dialog.component';

describe('FailedLoginDialogComponent', () => {
  let component: FailedSignInDialogComponent;
  let fixture: ComponentFixture<FailedSignInDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedSignInDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedSignInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
