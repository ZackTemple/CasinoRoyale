import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

import { ResendConfirmationEmailComponent } from './resend-confirmation-email.component';

describe('ResendConfirmationEmailComponent', () => {
  let component: ResendConfirmationEmailComponent;
  let fixture: ComponentFixture<ResendConfirmationEmailComponent>;
  let mockAuthService;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['resendConfirmationCode']);
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
});
