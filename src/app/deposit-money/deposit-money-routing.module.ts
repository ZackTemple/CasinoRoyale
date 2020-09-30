import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DepositMoneyComponent } from './deposit-money.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'deposit-money', component: DepositMoneyComponent}
    ])
  ],
  exports: [ RouterModule ]
})
export class DepositMoneyRoutingModule { }
