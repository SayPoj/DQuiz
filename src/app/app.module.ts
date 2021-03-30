import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http'
import {DatePipe, registerLocaleData} from "@angular/common";
import localeRu from "@angular/common/locales/ru";


registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [
    AppComponent
  ],
  providers:[
    DatePipe,
    { provide: LOCALE_ID, useValue: 'ru' }
  ]
})
export class AppModule { }
