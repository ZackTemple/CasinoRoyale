import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepositMoneyComponent } from './deposit-money.component';
import { DepositMoneyRoutingModule } from './deposit-money-routing.module';

@NgModule({
  declarations: [
    DepositMoneyComponent
  ],
  imports: [
    CommonModule,
    DepositMoneyRoutingModule
  ]
})
export class DepositMoneyModule { }
