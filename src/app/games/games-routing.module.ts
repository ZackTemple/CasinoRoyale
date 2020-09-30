import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamesComponent } from './games.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'games', component: GamesComponent}
    ])
  ],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
