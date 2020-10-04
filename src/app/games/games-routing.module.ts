import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamesComponent } from './games.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { TexasHoldemComponent } from './texas-holdem/texas-holdem.component';
import { OmahaHoldemComponent } from './omaha-holdem/omaha-holdem.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'games',
        component: GamesComponent,
        children: [
          {path: 'blackjack', component: BlackjackComponent},
          {path: 'texas-holdem', component: TexasHoldemComponent},
          {path: 'omaha-holdem', component: OmahaHoldemComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
