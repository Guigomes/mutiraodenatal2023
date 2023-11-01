import { NgModule, isDevMode, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import {MatStepperModule} from '@angular/material/stepper';

import { FlexLayoutModule } from '@angular/flex-layout';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { RelatorioExcluirDialog, RelatoriosComponent } from './relatorios/relatorios.component';
import {  NovoRelatorioComponent } from './novo-relatorio/novo-relatorio.component';
import {  MostrarImagemDialog } from './app.component';

import {  PreviewRelatorioComponent } from './preview-relatorio/preview-relatorio.component';

import { MaterialModule } from './material.module';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { ProgressDialogModule } from './components/progress-dialog/progress-dialog.module';
import { AlertDialog } from './components/alert-dialog/alert-dialog.component';
import { AlertDialogModule } from './components/alert-dialog/alert-dialog.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './components/paginator.tradutor';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};
@NgModule({
  declarations: [
    AppComponent,
    RelatoriosComponent,
    NovoRelatorioComponent,
    PreviewRelatorioComponent,
    RelatorioExcluirDialog,
    MostrarImagemDialog,

  ],
  imports: [
    MatNativeDateModule,
    ProgressDialogModule,
    AlertDialogModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    MatStepperModule,
    AngularFireAuthModule,
    MatProgressBarModule,
    NgxMaskModule.forRoot(maskConfigFunction),
        ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule
  ],
  providers: [ {
    provide: MatPaginatorIntl, 
    useClass: CustomMatPaginatorIntl
  },
  {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
],
  entryComponents:[
    RelatorioExcluirDialog,
    MostrarImagemDialog
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
