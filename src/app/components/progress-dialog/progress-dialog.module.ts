import { NgModule, isDevMode, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



import { FlexLayoutModule } from '@angular/flex-layout';

import {MatProgressBarModule} from '@angular/material/progress-bar';


import { MaterialModule } from "../../material.module";
import { ProgressDialog } from './progress-dialog.component';


@NgModule({
  declarations: [
   ProgressDialog
  ],
  imports: [

    MaterialModule,
    FlexLayoutModule,

    MatProgressBarModule,

  ],
  providers: [],
  entryComponents:[
    ProgressDialog
  ],
  bootstrap: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ProgressDialogModule { }
