import { Component, Inject} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'progress-dialog',
  templateUrl: 'progress-dialog.html',
  styleUrls: ['./progress-dialog.scss']
})
export class ProgressDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
