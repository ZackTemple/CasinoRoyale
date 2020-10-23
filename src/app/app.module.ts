import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { GamesModule } from './games/games.module';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FailedLoginDialogComponent } from './auth/dialog/failed-login-dialog.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppRoutingModule.components,
    FailedLoginDialogComponent,
    SignUpComponent

  ],
  imports: [
    BrowserModule,
    GamesModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [FailedLoginDialogComponent]
})
export class AppModule { }
