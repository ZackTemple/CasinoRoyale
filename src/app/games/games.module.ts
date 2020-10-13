import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { OmahaHoldemComponent } from './omaha-holdem/omaha-holdem.component';
import { TexasHoldemComponent } from './texas-holdem/texas-holdem.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    GamesComponent,
    BlackjackComponent,
    OmahaHoldemComponent,
    TexasHoldemComponent
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonModule,
    FormsModule
  ]
})
export class GamesModule { }
