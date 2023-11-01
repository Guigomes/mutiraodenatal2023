

import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RelatoriosService } from '../services/relatorios.service';
import autoTable from 'jspdf-autotable'

import { Evento } from '../models/evento';
import { ActivatedRoute, Router } from '@angular/router';
import Resumo from '../models/resumo';
import { MatSnackBar } from '@angular/material/snack-bar';
import Relatorio from '../models/relatorio';
import Imagem from '../models/imagem';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';

import { MatStepper } from '@angular/material/stepper';


import { AppComponent } from '../app.component';
import { base64Header2 } from '../models/headerBase64-2';
import { simbolBase64 } from '../models/simbolBase64';
import { ProgressDialog } from '../components/progress-dialog/progress-dialog.component';


@Component({
  selector: 'app-novo-relatorio',
  templateUrl: './novo-relatorio.component.html',
  styleUrls: ['./novo-relatorio.component.scss']
})
export class NovoRelatorioComponent implements OnInit {

  public ufs: String[] = ["AC",
    "AL",
    "AM",
    "AP",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MG",
    "MS",
    "MT",
    "PA",
    "PB",
    "PE",
    "PI",
    "PR",
    "RJ",
    "RN",
    "RO",
    "RR",
    "RS",
    "SC",
    "SE",
    "SP",
    "TO"];

  private idRelatorio: string = "";
  private idResumo: string = "";
  private uploadEvent: any;
  public ufSelecionada: String = "";
  public mostrarProgressBar: boolean = false;
  public title = "Novo Relatório";


  private relatorio: Relatorio | null = null;

  public getScreenWidth: any;

  public observacoesFormGroup: FormGroup = new FormGroup({
    observacoes: new FormControl('')
  });

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
  }
  public informacoesGeraisFormGroup: FormGroup;
  constructor(private storage: AngularFireStorage, private router: Router, private _snackBar: MatSnackBar, private route: ActivatedRoute, private relatoriosService: RelatoriosService, private _formBuilder: FormBuilder, public dialog: MatDialog, public fb: FormBuilder) {
    AppComponent.mostrarBackButton = true;

    this.informacoesGeraisFormGroup = new FormGroup({
      titulo: new FormControl(''),
      cliente: new FormControl(''),
      local: new FormControl(''),
      cidade: new FormControl(''),
      data: new FormControl(this.getDataHojeFormatada()),
      revestimento: new FormControl(''),
      poco: new FormControl(''),
      diametro: new FormControl(''),
      reducao: new FormControl(null),
      nivel: new FormControl(null),
      uf: new FormControl(''),

      fimRevestimento: new FormControl(null),

      profundidade: new FormControl(null),


    });
    console.log("DATA", this.informacoesGeraisFormGroup.value.data);

    this.route.queryParams.subscribe((params: any)=> {
      this.idRelatorio = params['idRelatorio'];
      this.idResumo = params['id'];
      console.log("idRelatorio", this.idRelatorio);
      console.log("idResumo", this.idResumo);

      if (this.idRelatorio !== undefined && this.idRelatorio.length > 0) {
        this.title = "Editar Relatório";
        this.mostrarProgressBar = true;
        this.relatoriosService.buscarRelatorio(this.idRelatorio).subscribe((relatorio: Relatorio | undefined) => {
          console.log("relatorio", relatorio);
          if (relatorio) {
            this.relatorio = relatorio;
          }
          this.informacoesGeraisFormGroup = new FormGroup({
            titulo: new FormControl(relatorio?.titulo),
            cliente: new FormControl(relatorio?.cliente),
            local: new FormControl(relatorio?.local),
            cidade: new FormControl(relatorio?.cidade),
            data: new FormControl(relatorio?.data),
            revestimento: new FormControl(relatorio?.revestimento),
            poco: new FormControl(relatorio?.poco),
            diametro: new FormControl(relatorio?.diametro),
            reducao: new FormControl(relatorio?.reducao),
            uf: new FormControl(relatorio?.uf),

            nivel: new FormControl(relatorio?.nivel),

            fimRevestimento: new FormControl(relatorio?.fimRevestimento),

            profundidade: new FormControl(relatorio?.profundidade),


          });
          this.observacoesFormGroup = new FormGroup({
            observacoes: new FormControl(relatorio?.observacoes)
          });
          if (relatorio?.eventos && relatorio.eventos.length > 0) {
            this.eventos = relatorio.eventos;
          }
          this.eventos.push({
            profundidade: "",
            evento: "",
            obs: "",
            position: this.eventos.length + 1
          });
          this.dataSource = new MatTableDataSource<Evento>(this.eventos);
          this.items = [];
          if (relatorio?.imagens && relatorio.imagens.length > 0) {
            relatorio.imagens.forEach((imagem: any) => {
              this.items.push({
                id: this.items.length + 1,

                url: imagem.url,
                legenda: imagem.legenda
              });

            });

          }
          console.log("EVENTOS", this.eventos);
          this.mostrarProgressBar = false;
        }, (error : any) => {
          this.toast("Erro ao buscar relatório: " + error);
          this.mostrarProgressBar = false;

        });
      } else {
        this.eventos.push({
          profundidade: "",
          evento: "",
          obs: "",
          position: this.eventos.length + 1
        });
        this.dataSource = new MatTableDataSource<Evento>(this.eventos);

      }
    });




    this.uploadForm = this.fb.group({
      avatar: [null],
      legenda: ['']
    });


  }


  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }
  private getDataHojeFormatada() {
    return new Date().toISOString().slice(0, 10)

  }



  eventos: Evento[] = [

  ];




  animal: string = "";
  name: string = "";
  imageURL: string = "";
  uploadForm: FormGroup;

  displayedColumns: string[] = ['position', 'profundidade', 'evento', 'obs'];

  dataSource = new MatTableDataSource<Evento>(this.eventos);

  items: Array<Imagem> = [


  ];

  public ampliarImagem(imagem: any) {

   
  }

  private buildNovoRelatorio() {
    var novoRelatorio = this.informacoesGeraisFormGroup.value;

    novoRelatorio.observacoes = this.observacoesFormGroup.value.observacoes;

    let novosEventos = this.eventos.filter((evento) => evento.evento.length > 0 && evento.profundidade.length > 0);

    console.log("Novos Eventos", novosEventos);

    novoRelatorio.eventos = novosEventos;
    if (this.relatorio && this.relatorio?.imagens) {
      novoRelatorio.imagens = this.relatorio?.imagens;
    }

    return novoRelatorio;
  }
  salvar(mensagemToast: string = "Relatório alterado com sucesso") {
    return new Promise((resolve, reject) => {


      if (!this.informacoesGeraisFormGroup.valid) {
        this.toast("O campos Titulo, Cliente e Data devem ser preenchidos");
      } else {
        this.mostrarProgressBar = true;
        console.log("id", this.idRelatorio);

        console.log("eventos", this.eventos);
        if (this.idRelatorio) {

          console.log("Relatorio Antigo", this.relatorio);
          console.log("Relatorio Novo", this.informacoesGeraisFormGroup.value);

          if (this.relatorio?.titulo != this.informacoesGeraisFormGroup.value.titulo || this.relatorio?.data != this.informacoesGeraisFormGroup.value.data || this.relatorio?.cliente != this.informacoesGeraisFormGroup.value.cliente) {
            var resumo: Resumo = {
              titulo: this.informacoesGeraisFormGroup.value.titulo,
              data: this.informacoesGeraisFormGroup.value.data,
              cliente: this.informacoesGeraisFormGroup.value.cliente,
              idRelatorio: this.idRelatorio
            };
            this.relatoriosService.updateResumo(this.idResumo, resumo);
          }

          var novoRelatorio = this.buildNovoRelatorio();
          console.log("Novo Relatório", novoRelatorio);
          this.relatoriosService.updateRelatorio(this.idRelatorio, novoRelatorio).then(() => {
            this.toast(mensagemToast);


            this.mostrarProgressBar = false;
            resolve(true);
          }).catch((error: any) => {
            this.toast("Houve um erro ao salvar o relatório: " + error);
            this.mostrarProgressBar = false;
            reject();
          });
        } else {
          console.log("Primeira Vez");

          var novoRelatorio = this.buildNovoRelatorio();

          console.log("novoRelatorio", novoRelatorio);

          this.relatoriosService.addRelatorio(novoRelatorio).then((novoRelatorioSalvo) => {
            this.idRelatorio = novoRelatorioSalvo.id;
            console.log("Novo relatorio", novoRelatorioSalvo.id);
            this.relatorio = novoRelatorio;

            var resumo: Resumo = {
              titulo: this.informacoesGeraisFormGroup.value.titulo,
              data: this.informacoesGeraisFormGroup.value.data,
              cliente: this.informacoesGeraisFormGroup.value.cliente,
              idRelatorio: novoRelatorioSalvo.id
            }
            this.relatoriosService.addResumo(resumo).then((resumoSalvo) => {

              this.idResumo = resumoSalvo.id;
              this.toast("Relatório Salvo com sucesso");


              this.mostrarProgressBar = false;
              resolve(true);

            }).catch((error: any) => {
              this.toast("Houve um erro ao salvar o relatório: " + error);
              this.mostrarProgressBar = false;
              reject();
            });
          }).catch((error: any) => {
            this.toast("Houve um erro ao salvar o relatório: " + error);
            this.mostrarProgressBar = false;
            reject();
          });

        }
      }
    });
  }



  validarInserirNovaLinha(index: number) {

    if (index + 1 == this.eventos.length) {
      this.eventos.push({
        profundidade: "",
        evento: "",
        obs: "",
        position: this.eventos.length + 1
      });

      this.dataSource = new MatTableDataSource<Evento>(this.eventos);
    }
  }

  showPreview(event: any) {
    this.mostrarProgressBar = true;
    const file = event?.target.files[0];
    this.uploadForm.patchValue({
      avatar: file
    });

    this.uploadForm.get('avatar')?.updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.uploadEvent = event;
      this.mostrarProgressBar = false;
    }
    reader.readAsDataURL(file)
  }

  private upload(event: any, legenda: string) {
   
  }
  // Submit Form
  submit() {

    if (this.uploadForm.valid) {
      console.log("SUBMIT");

      this.items = [
        ...this.items,
        {
          id: this.items.length + 1,

          url:
            this.imageURL,
          legenda:
            this.uploadForm.value.legenda,

        }];


      this.upload(this.uploadEvent, this.uploadForm.value.legenda);


    } else {
      this.toast("Informe a legenda da imagem");
    }

  }

  public validarSubmit(stepper: any) {

    if (!this.informacoesGeraisFormGroup.valid) {
      this.toast("O campos Titulo, Cliente e Data devem ser preenchidos");
    } else {

      stepper.next();
    }
    console.log("FirstForm", this.informacoesGeraisFormGroup.valid);



  }

  private formatDecimalNumber(number: number | string) {
  
  }
  public preview() {
    this.salvar().then(() => {
      console.log("GERAR", new Date());
      var dialogRef = this.dialog.open(ProgressDialog, {
        data: {
          mensagem: "Gerando o Relatório em PDF"
        },
      });
      dialogRef.afterOpened().subscribe(() => {
        console.log("ABRIU", dialogRef);
  
        console.log("relatorio", this.relatorio);
        let endereco = "Rua Lilia Elisa Eberle Lupo, 501 - casa 187 - Salto Grande. \n CEP: 14.803-886  Araraquara-SP. Fone: (16) 3322-0619.\nwww.hidroimagem.com.br";
        let textoCapa = "O trabalho de perfilagem ótica é composto de DVD contendo imagens coloridas geradas por câmeras introduzidas simultaneamente em um poço e um relatório com informações sobre as imagens captadas pelas câmeras. A combinação das duas situações auxilia a tomada de decisões no ato de trabalhar o poço.\n A HIDROIMAGEM SERVIÇOS DE PERFILAGEM, não se responsabiliza por tais decisões.";
        if (this.relatorio) {
          const doc = new jsPDF({
            orientation: "portrait",
            unit: "cm",
            format: 'a4'
          });
  
          console.log("REL 1");
          var width = doc.internal.pageSize.getWidth();
  
          this.addCapa(this.relatorio, doc, textoCapa, endereco);
  
          this.novaPagina(doc, endereco);
  
          this.addInformacoesGerais(this.relatorio, doc);
  
          this.addObservacoes(this.relatorio, doc, endereco);
  
          console.log("REL 2");
          this.novaPagina(doc, endereco);
  
          this.addEventos(this.relatorio, doc, endereco);
  
          this.novaPagina(doc, endereco);
  
          this.addImagens(this.relatorio, doc, endereco);
  
          console.log("REL 3");
          /*
                  this.novaPagina(doc, endereco);
          
                  doc.setFont("", 'bold');
          
                  doc.setFontSize(14);
          
                  doc.setLineWidth(0.03);
          
                  doc.setDrawColor(0, 0, 0);
          
                  doc.line(5, 25.5, 16, 25.5);
                  doc.text("Gilberto Gonçalves Domingos", width / 2, 26, { align: 'center', maxWidth: 21 });
                  doc.text("Diretor", width / 2, 26.5, { align: 'center', maxWidth: 21 });
          */
  
          doc.save(this.relatorio.titulo + " - " + this.relatorio?.cliente + ".pdf");
          console.log("Terminou", new Date());
          dialogRef.close();
        } else {
          this.toast("Erro ao gerar PDF. Relatório não encontrado.");
          dialogRef.close();
  
        }
      });
    });
  




  }
  addImagens(relatorio: Relatorio, doc: jsPDF, endereco: string) {
    var width = doc.internal.pageSize.getWidth();

    doc.setFont("", 'bold');

    doc.setFontSize(20);

    doc.text("Foto Imagem", width / 2, 5, { align: 'center', maxWidth: 21 });

    var heightInicialImagens = 6.5;

    doc.setFontSize(12);

    doc.setFont("", 'normal');

    var x = 1;
    console.log("imagems", relatorio.imagens);

    if (relatorio.imagens) {
      relatorio.imagens.forEach((imagem: any) => {
        if (heightInicialImagens == 28.5) {
          this.novaPagina(doc, endereco);
          heightInicialImagens = 6.5;
        }
        doc.addImage(imagem.url, 'PNG', x, heightInicialImagens, 9.5, 8);
        if (x == 1) {
          doc.text(imagem.legenda, 5.75, heightInicialImagens + 8.5, { align: 'center', maxWidth: 9.5 });
          x = 11;
        } else {
          x = 1;
          doc.text(imagem.legenda, 15.5, heightInicialImagens + 8.5, { align: 'center', maxWidth: 9.5 });
          heightInicialImagens += 11;

        }


      });
    }
  }
  addEventos(relatorio: Relatorio, doc: jsPDF, endereco: string) {
    var width = doc.internal.pageSize.getWidth();

    doc.setFont("", 'bold');
    doc.setFontSize(20);
    doc.text("Características do Poço", width / 2, 5, { align: 'center', maxWidth: 21 });


    doc.setFont("", 'normal');
    doc.setFontSize(18);



    var eventosBody: any[] = [];

    relatorio.eventos.forEach((evento) => {
      if (evento.evento && evento.evento.length > 0) {
        eventosBody.push([evento.profundidade, evento.evento, evento.obs]);
      }

    });

    autoTable(doc, {
      startY: 6,
      headStyles: {
        valign: 'middle',
        halign: 'center'
      },
      margin: { top: 5, bottom: 4 },
      showHead: "everyPage",
      didDrawPage: function (data) {
        doc.addImage(base64Header2, 'PNG', 1, 1, 19, 3);

        doc.setFontSize(12);

        doc.text(endereco, width / 2, 28.5, { align: 'center', maxWidth: 16 });

      },
      columnStyles: {
        0: { cellWidth: 6, halign: 'center' },
        1: { cellWidth: 6, halign: 'center', },
        2: { cellWidth: 6, halign: 'center', }
      },

      styles: {
        overflow: 'linebreak',
        valign: 'middle',
        fontSize: 14
      },
      head: [["Profundidade (m)", "Evento", "Observações"]],

      body: eventosBody,
    });



  }
  private addObservacoes(relatorio: Relatorio, doc: jsPDF, endereco: string) {
    if (relatorio.observacoes) {
      var width = doc.internal.pageSize.getWidth();

      var observacoes = relatorio.observacoes.split("\n");



      doc.text("Observações", width / 2, 19, { align: 'center', maxWidth: 21 });

      doc.setFontSize(14);

      doc.setFont("", 'normal');

      var observacoesTable: any[] = [];
      observacoes.forEach((observacao: string) => {
        if (observacao.length > 0) {
          observacoesTable.push([observacao]);
        }
      });
      if (observacoesTable.length > 0) {
        autoTable(doc, {
          theme: "plain",
          startY: 19,

          headStyles: {
            valign: 'middle',
            halign: 'center'
          },

          didDrawCell: function (data) {
            if (data.column.index === 0 && data.cell.section === 'body') {

              var textPos = data.cell.getTextPos();

              doc.addImage(simbolBase64, 2.4, textPos.y - 0.3, 0.5, 0.5);
            }
          },
          margin: { top: 5, left: 3, bottom: 4 },
          showHead: "everyPage",
          didDrawPage: function (data) {
            doc.addImage(base64Header2, 'PNG', 1, 1, 19, 3);

            doc.setFontSize(12);

            doc.text(endereco, width / 2, 28.5, { align: 'center', maxWidth: 16 });

          },
          columnStyles: {
            0: { cellWidth: 17, halign: 'left' },
          },

          styles: {
            overflow: 'linebreak',
            valign: 'middle',
            fontSize: 14
          },
          head: [[""]],

          body: observacoesTable,
        });

      }
    }

  }


  private addCapa(relatorio: Relatorio, doc: jsPDF, textoCapa: string, endereco: string) {

    var width = doc.internal.pageSize.getWidth();

    doc.addImage(base64Header2, 'PNG', 1, 1, 19, 3);

    doc.setFont("Times New Roman");

    doc.setFontSize(30);

    doc.text(relatorio.titulo, width / 2, 9, { align: 'center', maxWidth: 16 });

    doc.text("Cliente: ", width / 2, 13, { align: 'center', maxWidth: 21 });

    doc.setFontSize(25);

    doc.text(relatorio.cliente, width / 2, 14, { align: 'center', maxWidth: 21 });

    var data = relatorio.data.substring(8, 10) + "/" + relatorio.data.substring(5, 7) + "/" + relatorio.data.substring(0, 4);

    doc.setFontSize(30);

    doc.text("LOCAL E DATA: ", width / 2, 16, { align: 'center', maxWidth: 21 });

    doc.setFontSize(25);

    doc.text(relatorio.local + " " + data, width / 2, 17, { align: 'center', maxWidth: 21 });

    doc.setFontSize(12);

    doc.setFont("", 'bold');

    doc.text(textoCapa, 3, 24, { align: 'justify', maxWidth: 15 });

    doc.setFont("", 'normal');
    doc.text(endereco, width / 2, 28.5, { align: 'center', maxWidth: 16 });

  }

  private addInformacoesGerais(relatorio: Relatorio, doc: jsPDF) {
    

  }
  private novaPagina(doc: jsPDF, endereco: string) {
    var width = doc.internal.pageSize.getWidth();

    doc.addPage();
    doc.addImage(base64Header2, 'PNG', 1, 1, 19, 3);

    doc.setFontSize(12);
    doc.text(endereco, width / 2, 28.5, { align: 'center', maxWidth: 16 });

  }

  private toast(message: string) {
    this._snackBar.open(message, "Fechar", { duration: 7000 });
  }
}
