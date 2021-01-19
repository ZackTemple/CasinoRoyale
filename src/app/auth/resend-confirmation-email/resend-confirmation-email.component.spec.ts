import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';

import { ResendConfirmationEmailComponent } from './resend-confirmation-email.component';

describe('ResendConfirmationEmailComponent', () => {
  let component: ResendConfirmationEmailComponent;
  let fixture: ComponentFixture<ResendConfirmationEmailComponent>;
  let mockAuthService;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['resendConfirmationCode']);
    mockAuthService.resendConfirmationCode.and.returnValue(of(true));
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatDialogModule ],
      declarations: [ ResendConfirmationEmailComponent ],
      providers: [ {provide: AuthService, useValue: mockAuthService} ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendConfirmationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClickResendEmailConfirmation()', () => {
    it('should call auth service to resend verificiation email for user', () => {
      component.username = 'michael-scott';
      component.confirmationSent = false;

      component.onClickResendEmailConfirmation();

      expect(mockAuthService.resendConfirmationCode).toHaveBeenCalledTimes(1);
      expect(component.confirmationSent).toBeTruthy();
    });
  });
});
