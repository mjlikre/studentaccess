import { BrowserModule } from '@angular/platform-browser';
import {
  NoopAnimationsModule,
  // BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IonicStorageModule } from '@ionic/storage';

import { StoreModule } from '@ngrx/store';
import { rootReducer } from '../store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import Effects from '../effects';

import { StudentAccess } from './app';

import { Store } from '../providers/store';
import { Auth } from '../providers/auth';
import { State } from '../providers/state';
import { Log } from '../providers/log';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    StudentAccess
  ],
  imports: [
    BrowserModule,
    // NoopAnimationsModule works but BrowserAnimationsModule doesn't
    NoopAnimationsModule,
    // BrowserAnimationsModule,
    IonicModule.forRoot(StudentAccess),
    IonicStorageModule.forRoot({
      name: 'studentaccess',
      driverOrder: ['indexeddb', 'websql', 'localstorage']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      }
    }),
    HttpClientModule,
    StoreModule.forRoot({ root: rootReducer }),
    EffectsModule.forRoot([Effects]),
    StoreDevtoolsModule.instrument({
      maxAge: 10,
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [StudentAccess],
  providers: [
    Store,
    Auth,
    State,
    HttpClientModule,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Log,
  ]
})
// renamed to AppModule to solve prod env bug ¯\_(ツ)_/¯
export class AppModule { };
