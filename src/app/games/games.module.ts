import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesRoutingModule } from './games-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
@NgModule({
  declarations: [
    GamesRoutingModule.components
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    FormsModule,
    MatTabsModule
  ]
})
export class GamesModule {}
