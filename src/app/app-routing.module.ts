import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { LogInComponent } from './logIn/log-in.component';
import { AuthGuard } from './auth/auth.guard';
import { PersonalAccountComponent } from './personal-account/personal-account.component';
import { DepositMoneyComponent } from './deposit-money/deposit-money.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'login', component: LogInComponent},
      {path: 'deposit-money', canActivate: [AuthGuard], component: DepositMoneyComponent},
      {path: 'personal-account', canActivate: [AuthGuard], component: PersonalAccountComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: '**', redirectTo: 'home', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
