import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { TexasHoldemComponent } from './texas-holdem/texas-holdem.component';
import { SlotMachineComponent } from './slot-machine/slot-machine.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'games',
    canActivate: [AuthGuard],
    children: [
      {path: '', component: GamesComponent},
      {path: 'blackjack', component: BlackjackComponent},
      {path: 'texas-holdem', component: TexasHoldemComponent},
      {path: 'slot-machine', component: SlotMachineComponent}
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
    SlotMachineComponent,
    TexasHoldemComponent
  ];
}
