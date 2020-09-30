import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DepositMoneyModule } from './deposit-money/deposit-money.module';
import { AppRoutingModule } from './app-routing.module';
import { GamesModule } from './games/games.module';

import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    GamesModule,
    DepositMoneyModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
