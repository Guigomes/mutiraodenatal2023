import { NgModule } from '@angular/core';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
      MatProgressSpinnerModule,
      MatPaginatorModule,
      MatDatepickerModule, 
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatButtonModule,
        FormsModule,
        MatCardModule,
        MatGridListModule,
        MatDividerModule,
        MatTableModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    exports:[
      MatFormFieldModule,
      MatInputModule,
      MatToolbarModule,
      MatIconModule,
      MatSelectModule,
      MatPaginatorModule,
      ReactiveFormsModule,
      MatButtonModule,
      FormsModule,
      MatCardModule,
      MatGridListModule,
      MatDividerModule,
      MatTableModule,
      MatDatepickerModule, 
      MatDialogModule,
      MatProgressSpinnerModule
    ]

})
export class MaterialModule { }
