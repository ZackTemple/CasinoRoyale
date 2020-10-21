import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { TexasHoldemComponent } from './texas-holdem/texas-holdem.component';
import { OmahaHoldemComponent } from './omaha-holdem/omaha-holdem.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'games',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: GamesComponent,
    children: [
      {path: 'blackjack', component: BlackjackComponent},
      {path: 'texas-holdem', component: TexasHoldemComponent},
      {path: 'omaha-holdem', component: OmahaHoldemComponent}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GamesRoutingModule {
  static components = [
    GamesComponent,
    BlackjackComponent,
    OmahaHoldemComponent,
    TexasHoldemComponent
  ];
}