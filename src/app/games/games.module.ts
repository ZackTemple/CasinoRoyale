import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { OmahaHoldemComponent } from './omaha-holdem/omaha-holdem.component';
import { TexasHoldemComponent } from './texas-holdem/texas-holdem.component';
@NgModule({
  declarations: [
    GamesComponent,
    BlackjackComponent,
    OmahaHoldemComponent,
    TexasHoldemComponent
  ],
  imports: [
    CommonModule,
    GamesRoutingModule
  ]
})
export class GamesModule { }
