import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import lgZoom from 'lightgallery/plugins/zoom';
import { LightGallery } from 'lightgallery/lightgallery';
import { RelatoriosService } from '../services/relatorios.service';

import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { Evento } from '../models/evento';
import { ActivatedRoute, Router } from '@angular/router';
import Resumo from '../models/resumo';
import { MatSnackBar } from '@angular/material/snack-bar';
import Relatorio from '../models/relatorio';
import Imagem from '../models/imagem';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-preview-relatorio',
  templateUrl: './preview-relatorio.component.html',
  styleUrls: ['./preview-relatorio.component.scss']
})
export class PreviewRelatorioComponent {

  private idRelatorio: string = "";
  private idResumo: string = "";
  public mostrarProgressBar: boolean = false;
  public title = "Novo Relatório";
  public relatorio: any;
  public imagem = "";
  constructor(private router: Router, private _snackBar: MatSnackBar, private route: ActivatedRoute, private relatoriosService: RelatoriosService) {



  }


  voltar() {
    this.router.navigateByUrl('/');

  }


  public gerar(): void {

    console.log("GERAR");

    let DATA: any = document.getElementById('pdf');
    console.log("DATA", DATA);
    html2canvas(DATA).then((canvas) => {

      console.log("canvas", canvas);
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });

  }
  private toast(message: string) {
    this._snackBar.open(message, "Fechar", { duration: 7000 });
  }
}

