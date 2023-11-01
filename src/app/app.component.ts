import { Component, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RelatoriosService } from './services/relatorios.service';
import * as auth from 'firebase/auth';
import { AlertDialog } from './components/alert-dialog/alert-dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hidroimagem';
  static mostrarBackButton: boolean = false;
  cols: number = 3;

  mostrarLoadingBar: boolean = true;
  items : any[];
  usuario: any;
  static usuarioLogado: boolean = false;
  usuariosPermitidos: any[] = [];

  constructor(breakpointObserver: BreakpointObserver, public dialog: MatDialog, private router: Router, public afAuth: AngularFireAuth, private rel: RelatoriosService, private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = 1;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = 1;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = 2;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = 3;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = 3;
        }
      }
    });

    this.matIconRegistry.addSvgIcon("logo", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/svg/Google.svg"));

    var usuario = localStorage.getItem('user');

    if (usuario !== undefined && usuario !== null) {
      this.usuario = JSON.parse(usuario);
      AppComponent.usuarioLogado = true;
      this.mostrarLoadingBar = false;

    } else {
     
    }
    this.items = [];
    for(var i = 1; i <=13; i++){
   
      this.items.push({
        id: i,

        url: "assets/fotos/" + i + ".jpg",
        legenda: "foto natal"
      });

    }
  }

  public ampliarImagem(imagem: any) {

    console.log("IMAGEM SELECIONADA", imagem);
    var dialogRef = this.dialog.open(MostrarImagemDialog, {
      
       
      data: {
        imagem: imagem,
      },
    });
  
  }
  public logout() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      AppComponent.usuarioLogado = false;

      this.router.navigateByUrl('/');

    });
  }
  back() {
    this.router.navigateByUrl('/');

  }
  public setUsuarioLogado(logado: boolean) {
    AppComponent.usuarioLogado = logado;
  }

  public getMostrarBackButton(): boolean {
    return AppComponent.mostrarBackButton;
  }

  public isUsuarioLogado(): boolean {
    return AppComponent.usuarioLogado;
  }

  public googleAuth() {

    return this.AuthLogin(new auth.GoogleAuthProvider()).then((data: any) => {
      this.usuario = data.user;
      this.validarUsuario();
    });
  }

  private validarUsuario() {




    let usuarioPermitido = this.usuariosPermitidos.find((usuario: any) => usuario.email == this.usuario.email);


    console.log("usuarioEmal", this.usuario.email);

    console.log("usuarioPermitido", usuarioPermitido);
    if (usuarioPermitido) {
      AppComponent.usuarioLogado = true;
      localStorage.setItem('user', JSON.stringify(this.usuario));
    } else {


      let dialogRef = this.dialog.open(AlertDialog, {
        data: { titulo: "Usuário não Cadastrado", mensagem: "O e-mail " + this.usuario.email + " não está autorizado à acessar o sistema. Entre em contato com o responsável." }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.afAuth.signOut().then(() => {
          localStorage.removeItem('user');
          AppComponent.usuarioLogado = false;
        });

      });

    }
    this.mostrarLoadingBar = false;
  }

  private AuthLogin(provider: any) {
    return this.afAuth
      .signInWithRedirect(provider)

      .catch((error) => {
        console.log("Error Sign-in", error);
      });
  }
  criarNovoRelatorio() {

    this.router.navigateByUrl('/novo');

  }


}
@Component({
  selector: 'mostrar-imagem-dialog.',
  templateUrl: 'mostrar-imagem-dialog.html',
  styleUrls: ['./app.component.scss']
})
export class MostrarImagemDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
