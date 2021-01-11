import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesRoutingModule } from './games-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HelperCardDialogComponent } from './blackjack/helper-card-dialog/helper-card-dialog.component';
@NgModule({
  declarations: [
    GamesRoutingModule.components,
    HelperCardDialogComponent
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class GamesModule {}
