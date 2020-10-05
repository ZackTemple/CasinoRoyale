import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamesComponent } from './games.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { TexasHoldemComponent } from './texas-holdem/texas-holdem.component';
import { OmahaHoldemComponent } from './omaha-holdem/omaha-holdem.component';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'games',
        canActivate: [AuthGuard],
        component: GamesComponent,
        children: [
          {path: 'blackjack', canActivate: [AuthGuard], component: BlackjackComponent},
          {path: 'texas-holdem', canActivate: [AuthGuard], component: TexasHoldemComponent},
          {path: 'omaha-holdem', canActivate: [AuthGuard], component: OmahaHoldemComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
