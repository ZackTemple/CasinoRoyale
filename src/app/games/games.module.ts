import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { TexasHoldemComponent } from './texas-holdem/texas-holdem.component';
import { OmahaHoldemComponent } from './omaha-holdem/omaha-holdem.component';
import { RouterModule } from '@angular/router';
import { GamesRoutingModule } from './games-routing.module';



@NgModule({
  declarations: [BlackjackComponent, TexasHoldemComponent, OmahaHoldemComponent],
  imports: [
    CommonModule,
    GamesRoutingModule
  ]
})
export class GamesModule { }
