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
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LogInComponent } from './logIn/log-in.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    GamesModule,
    DepositMoneyModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
