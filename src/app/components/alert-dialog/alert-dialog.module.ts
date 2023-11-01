import { NgModule, isDevMode, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



import { FlexLayoutModule } from '@angular/flex-layout';

import {MatProgressBarModule} from '@angular/material/progress-bar';


import { MaterialModule } from "../../material.module";
import { AlertDialog } from './alert-dialog.component';


@NgModule({
  declarations: [
    AlertDialog
  ],
  imports: [

    MaterialModule,
    FlexLayoutModule,

    MatProgressBarModule,


  ],
  exports: [AlertDialog],
  providers: [],
  entryComponents:[
    AlertDialog
  ],
  bootstrap: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AlertDialogModule { }
