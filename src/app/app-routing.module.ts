import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { LogInComponent } from './logIn/log-in.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'logIn', component: LogInComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: '**', redirectTo: 'home', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
