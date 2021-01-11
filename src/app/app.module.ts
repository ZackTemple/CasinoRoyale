import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { GamesModule } from './games/games.module';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FailedSignInDialogComponent } from './auth/dialog/failed-sign-in-dialog.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResendConfirmationEmailComponent } from './auth/resend-confirmation-email/resend-confirmation-email.component';

import { CacheInterceptor} from './cache/cache.interceptor';

@NgModule({
  declarations: [
    AppRoutingModule.components,
    FailedSignInDialogComponent,
    SignUpComponent,
    ResendConfirmationEmailComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GamesModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [FailedSignInDialogComponent]
})
export class AppModule { }
