import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { LogInComponent } from './auth/logIn/log-in.component';
import { AuthGuard } from './auth/auth.guard';
import { PersonalAccountComponent } from './personal-account/personal-account.component';
import { DepositMoneyComponent } from './deposit-money/deposit-money.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'sign-up', component: SignUpComponent},
      {path: 'login', component: LogInComponent},
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
    LogInComponent,
    PersonalAccountComponent,
    DepositMoneyComponent
  ];
}
