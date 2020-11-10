import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let mockAuthService;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['getPlayer']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule,
        SharedModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: AuthService, useValue: mockAuthService}
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'CasinoRoyale'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Casino Royale');
  });
});
