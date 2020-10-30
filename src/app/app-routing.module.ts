import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { AuthGuard } from './auth/auth.guard';
import { PersonalAccountComponent } from './personal-account/personal-account.component';
import { DepositMoneyComponent } from './deposit-money/deposit-money.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResendConfirmationEmailComponent } from './auth/resend-confirmation-email/resend-confirmation-email.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'sign-up', component: SignUpComponent},
      {path: 'sign-in', component: SignInComponent},
      {path: 'resend-confirmation-email', component: ResendConfirmationEmailComponent},
      {path: 'deposit-money', canActivate: [AuthGuard], component: DepositMoneyComponent},
      {path: 'personal-account', canActivate: [AuthGuard], component: PersonalAccountComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: '**', redirectTo: 'home', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static components = [
    AppComponent,
    HomeComponent,
    SignUpComponent,
    SignInComponent,
    PersonalAccountComponent,
    DepositMoneyComponent
  ];
}
