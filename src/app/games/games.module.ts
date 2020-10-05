import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { OmahaHoldemComponent } from './omaha-holdem/omaha-holdem.component';
import { TexasHoldemComponent } from './texas-holdem/texas-holdem.component';

import {MatTabsModule} from '@angular/material/tabs';
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
    MatTabsModule
  ]
})
export class GamesModule { }
