import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as auth from 'firebase/auth';
import { RelatoriosService } from '../services/relatorios.service';
import { MatTableDataSource } from '@angular/material/table';
import Resumo from '../models/resumo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertDialog } from '../components/alert-dialog/alert-dialog.component';
import { MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent {

  public resumos: any[] = [];
  public colunasTabelaResumos: string[] = ['cliente', 'data', 'titulo', 'action'];
  public dataSource = new MatTableDataSource<Resumo>([]);
  public mostrarProgressBar: boolean = true;
  clickedRows = new Set<any>();
  usuarioLogado: boolean = false;
  usuario: any;
  tempPaginator : any;
  dataInicial : any = new Date();
  dataFinal : any = new Date();
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this.tempPaginator = value;

  }

  constructor(private router: Router, private rel: RelatoriosService, public dialog: MatDialog, private _snackBar: MatSnackBar) {



    AppComponent.mostrarBackButton = false;
    this.buscarRelatorios();

  }


  private buscarRelatorios() {

    this.rel.buscarRelatorios().subscribe((result: any) => {
this.resumos = result;
this.dataSource = new MatTableDataSource<Resumo>(this.resumos);
this.dataSource.paginator = this.tempPaginator;

      this.mostrarProgressBar = false;
    
    });
  }

  public isUsuarioLogado() {
    return AppComponent.usuarioLogado;
  }

  consultar(){
    alert("TESTE");
  }
  deletar(element: any) {

    let dialogRef = this.dialog.open(RelatorioExcluirDialog);
    console.log("Elemento  a deletar", element);

    dialogRef.afterClosed().subscribe((result : any) => {

      if (result == true) {
        this.mostrarProgressBar = true;

        this.rel.excluirRelatorio(element.id).then((response) => {
          console.log("response", response);
          this.toast("Relatório excluído com sucesso");
          this.mostrarProgressBar = false;
        }).catch((error: any) => {
          this.toast("Houve um erro ao exlcuir o relatório: " + error);
          this.mostrarProgressBar = false;
        });
      }
    });

  }
  public abrirRelatorio(resumo: Resumo) {
    console.log("resumo", resumo);
    this.router.navigateByUrl('/novo?idRelatorio=' + resumo.idRelatorio + "&id=" + resumo.id);
  }

  criarNovoRelatorio() {

    this.router.navigateByUrl('/novo');

  }


  private toast(message: string) {
    this._snackBar.open(message, "Fechar", { duration: 7000 });
  }
}
@Component({
  selector: 'relatorio-excluir-dialog',
  templateUrl: 'relatorio-excluir-dialog.html',
})
export class RelatorioExcluirDialog {
  constructor(
    public dialogRef: MatDialogRef<RelatorioExcluirDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
}
