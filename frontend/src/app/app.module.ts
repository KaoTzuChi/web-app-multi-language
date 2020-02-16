import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatListModule, MatRadioModule,
  MatTableModule, MatFormFieldModule, MatInputModule,
  MatCheckboxModule, MatButtonModule, MatToolbarModule, MatSidenavModule, 
  MatSelectModule, MatDialogModule, MatButtonToggleModule } from '@angular/material';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApimessageService } from './message/apimessage/apimessage.service';
import { ApimessageComponent } from './message/apimessage/apimessage.component';
import { RequestCache, RequestCacheWithMap } from './api-interactor/request-cache.service';
import { HttpErrorHandler } from './api-interactor/http-error-handler.service';

// create TranslateHttpLoader as the locals loader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ApimessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule
  ],
  providers: [
    HttpErrorHandler,
    ApimessageService,
    { provide: RequestCache, useClass: RequestCacheWithMap },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
