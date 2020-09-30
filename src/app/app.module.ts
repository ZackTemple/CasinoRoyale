import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DepositMoneyModule } from './deposit-money/deposit-money.module';
import { AppRoutingModule } from './app-routing.module';
import { GamesModule } from './games/games.module';

import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

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
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
