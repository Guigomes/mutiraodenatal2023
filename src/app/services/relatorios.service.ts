import { ReadKeyExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import Relatorio from '../models/relatorio';
import Resumo from '../models/resumo';
@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

  private resumos: AngularFirestoreCollection<Resumo>;
  private relatorios: AngularFirestoreCollection<Relatorio>;
  private usuariosPermitidos: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.resumos = afs.collection<Resumo>('resumos');
    this.relatorios = afs.collection<Relatorio>('relatorios');
this.usuariosPermitidos =  afs.collection<Relatorio>('acesso');
  }
  excluirRelatorio(id: any) {
console.log("ID", id);
    var userDoc = this.afs.doc('resumos/' + id);
    console.log("userDoc", userDoc);
    return userDoc.delete();

  }
public buscarUsuariosPermitidos(){
  return this.usuariosPermitidos.valueChanges();
}

  public buscarRelatorios() {
    return this.resumos.valueChanges({ idField: 'id' });
  }
  public buscarRelatorio(id : string) {
    return this.relatorios.doc(id).valueChanges();
  }

  public addRelatorio(item: Relatorio) {
    return this.relatorios.add(item);
  }

  public addResumo(item: Resumo) {
    return this.resumos.add(item);
  }

  public updateRelatorio(id: string, newItem: any) {
   return  this.relatorios.doc(id).set(newItem);
  }

  public updateResumo(id: string, newItem: any) {
    return  this.resumos.doc(id).set(newItem);
   }
  public async getBase64ImageFromUrl(imageUrl: string): Promise<any> {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

}
