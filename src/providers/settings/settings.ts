import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import * as firebase from "firebase/app";

@Injectable()
export class SettingsProvider {
  db = firebase.firestore();
  categoria: AngularFirestoreCollection<any[]>;
  _categoria: Observable<any>;
  MetodosPago: AngularFirestoreCollection<any[]>;
  _MetodosPago: Observable<any>;
  Transporte: AngularFirestoreCollection<any[]>;
  _Transporte: Observable<any>;
  Arranque: AngularFirestoreCollection<any[]>;
  _Arranque: Observable<any>;
  Tarifas: AngularFirestoreCollection<any[]>;
  _Tarifas: Observable<any>;
  Banners: AngularFirestoreCollection<any[]>;
  _Banners: Observable<any>;
  catego: AngularFirestoreDocument<any[]>;
  _catego: Observable<any>;
  versionApp: AngularFirestoreDocument<any[]>;
  _versionApp: Observable<any>;

  constructor(public dbF: AngularFirestore) {
    console.log("Hello SettingsProvider Provider");
  }

  getCategorias() {
    const uidSucursal = localStorage.getItem("uidSucursal");
    this.categoria = this.dbF.collection<any>("categoria_critico", ref =>
      ref.where("uidSucursal", "==", uidSucursal).orderBy("posicion", "asc")
    );
    this._categoria = this.categoria.valueChanges();

    return (this._categoria = this.categoria.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getOneCategoria(idx) {
    this.catego = this.dbF.doc<any>(`categoria_critico/${idx}`);
    return (this._catego = this.catego.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getVersionApp(idx) {
    this.versionApp = this.dbF.doc<any>(`versionApp/${idx}`);
    return (this._versionApp = this.versionApp.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getEnRevision(idx) {
    this.versionApp = this.dbF.doc<any>(`enRevision/${idx}`);
    return (this._versionApp = this.versionApp.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getMetodosPago() {
    const uidSucursal = localStorage.getItem("uidSucursal");
    this.MetodosPago = this.dbF.collection<any>("metodos_pagos", ref =>
      ref.where("uidSucursal", "==", uidSucursal)
    );
    this._MetodosPago = this.MetodosPago.valueChanges();

    return (this._MetodosPago = this.MetodosPago.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getTransporte() {
    const uidSucursal = localStorage.getItem("uidSucursal");
    this.Transporte = this.dbF.collection<any>("transportes_config", ref =>
      ref.where("uidSucursal", "==", uidSucursal)
    );
    this._Transporte = this.Transporte.valueChanges();

    return (this._Transporte = this.Transporte.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getArranque() {
    const uidSucursal = localStorage.getItem("uidSucursal");
    this.Arranque = this.dbF.collection<any>("costos_fijos", ref =>
      ref.where("uidSucursal", "==", uidSucursal)
    );
    this._Arranque = this.Arranque.valueChanges();

    return (this._Arranque = this.Arranque.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getTarifas() {
    const uidSucursal = localStorage.getItem("uidSucursal");
    this.Tarifas = this.dbF.collection<any>("tarifas", ref =>
      ref.where("uidSucursal", "==", uidSucursal)
    );
    this._Tarifas = this.Tarifas.valueChanges();

    return (this._Tarifas = this.Tarifas.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  _getTarifasPLQ(): Promise<any> {
    const uidSucursal = localStorage.getItem("uidSucursal");
    return new Promise((resolve, reject) => {
      this.db
        .collection("tarifas")
        .where("uidSucursal", "==", uidSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  _getTarifasMenu(): Promise<any> {
    const uidSucursal = localStorage.getItem("uidSucursal");
    return new Promise((resolve, reject) => {
      this.db
        .collection("tarifas_menu")
        .where("uidSucursal", "==", uidSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  _getArranquePLQ(): Promise<any> {
    const uidSucursal = localStorage.getItem("uidSucursal");
    return new Promise((resolve, reject) => {
      this.db
        .collection("costos_fijos")
        .where("uidSucursal", "==", uidSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  _getArranqueMenu(): Promise<any> {
    const uidSucursal = localStorage.getItem("uidSucursal");
    return new Promise((resolve, reject) => {
      this.db
        .collection("costos_fijo_menu")
        .where("uidSucursal", "==", uidSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getBanners() {
    const uidSucursal = localStorage.getItem("uidSucursal");
    this.Banners = this.dbF.collection<any>("banners", ref =>
      ref.where("uidSucursal", "==", uidSucursal).where("estado", "==", "true")
    );
    this._Banners = this.Banners.valueChanges();

    return (this._Banners = this.Banners.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }
}
