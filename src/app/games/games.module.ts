import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesRoutingModule } from './games-routing.module';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    GamesRoutingModule.components
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class GamesModule {}
