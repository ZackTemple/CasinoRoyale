import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlackjackComponent } from './blackjack.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'blackjack', component: BlackjackComponent}
    ])
  ],
  exports: [ RouterModule ]
})
export class BlackjackRoutingModule { }
