import { Component, Inject} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'alert-dialog',
  templateUrl: 'alert-dialog.html',
  styleUrls: ['./alert-dialog.scss']
})
export class AlertDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
