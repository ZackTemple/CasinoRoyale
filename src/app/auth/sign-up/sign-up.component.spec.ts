import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let mockAuthService;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['signUp']);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatDialogModule ],
      declarations: [ SignUpComponent ],
      providers: [ {provide: AuthService , useValue: mockAuthService}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
