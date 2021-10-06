import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import * as moment from "moment";

@Injectable()
export class ServicesProvider {
  db = firebase.firestore();
  userID: any;
  servicioID: any;
  fechaMili: any;
  pedidoDoc: AngularFirestoreDocument<any[]>;
  pedido: Observable<any>;
  productos: AngularFirestoreCollection<any[]>;
  _productos: Observable<any>;
  pedidos: AngularFirestoreCollection<any[]>;
  _pedidos: Observable<any>;
  servicios: AngularFirestoreCollection<any[]>;
  _servicios: Observable<any>;
  serviciosP: AngularFirestoreCollection<any[]>;
  _serviciosP: Observable<any>;
  locationData: any;
  _locationData: any;
  favor: any;

  constructor(
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public nativeStorage: NativeStorage,
    public dbF: AngularFirestore
  ) {
    console.log("Hello ServicesProvider Provider");
    this.userID = localStorage.getItem("uid");
  }

  saveServicePQ(favor, nombreUsuario, photo) {
    return new Promise((resolve, reject) => {
      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");
        this.locationData = new firebase.firestore.GeoPoint(
          parseFloat(lat),
          parseFloat(lng)
        );
      const timestamp = Date.now().toString();
      const direEnd = localStorage.getItem("direEnd");
      const uidSucursal = localStorage.getItem("uidSucursal");
      const playerID = localStorage.getItem("playerID");
      const uid = localStorage.getItem("uid");
      console.log('favor: ', favor);
      if (favor == true) {
        this.favor = true;
      }else{
        this.favor = false;
      }
      this.db
        .collection("servicios")
        .add({
          clave: "#",
          estatus: "creando",
          fecha: timestamp,
          entregaGeo: this.locationData,
          entregaDir: direEnd,
          uidCliente: uid,
          tipo: 1,
          metodo_pago: "Efectivo",
          numTikets: 0,
          abierto: null,
          uidSucursal: uidSucursal,
          playerIDUser: playerID,
          favor: this.favor,
          nombreUsuario: nombreUsuario,
          photoUsuario: photo
        })
        .then(docRef => {
          console.log("Document successfully written!", docRef.id);

          this.updateServiceIDX(docRef.id);
          resolve({ success: true, servicioID: docRef.id });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  updateServiceIDX(idx) {
    console.log("Esta es la dirección: ", idx);
    
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          uid: idx
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  savePedidoPQ(servicioID, pedido) {
    return new Promise((resolve, reject) => {
      if (pedido.latPedido != null && pedido.lngPedido != null) {
        this._locationData = new firebase.firestore.GeoPoint(
          pedido.latPedido,
          pedido.lngPedido
        );
      } else {
        this._locationData = null;
      }
      this.db
        .collection("pedidos")
        .add({
          servicioID: servicioID,
          pedidoGeo: this._locationData,
          nombreLocal: pedido.placeName,
          direccionLocal: pedido.placeDire          
        })
        .then(function(docRef) {
          console.log("Document successfully written!", docRef.id);
          localStorage.setItem("pedidoID", docRef.id);
          resolve({ success: true, pedidoID: docRef.id });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  saveServiceProductPQ(producto, pedidoID, servicioID) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .add({
          cantidad: producto.cantidad,
          descripcion: producto.nota,
          producto: producto._nota,
          pedidoID: pedidoID,
          servicioID: servicioID
        })

        .then(function(docRef) {
          console.log("Document successfully written!", docRef.id);
          resolve({ success: true });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  updateLocationEntrega(lat, lng, idx, dire, apto) {
    console.log("Esta es la dirección actualizada_: ", dire);

    var promise = new Promise((resolve, reject) => {
      const locationData = new firebase.firestore.GeoPoint(lat, lng);
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          entregaGeo: locationData,
          entregaDir: dire,
          apto: apto
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  _updateLocationEntrega(idx, dire, apto) {
    console.log("Esta es la dirección actualizada_: ", dire);

    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          entregaDir: dire,
          apto: apto
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateTipoTransporte(idx, typeTransporte) {
    console.log("Este es el tipo de transporte", typeTransporte);

    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          tipoTransporte: typeTransporte
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateCalificacion(idx, calificacion, comentario) {
    console.log("Este es el tipo de transporte", calificacion);

    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          calificacionRepartidor: calificacion,
          comentarioRepartidor: comentario,
          estatus: "Terminado"
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateMetodoPagoTarjeta(idx, metodoPago, cardId, cardLast4, cardType) {
    console.log("Este es el tipo de transporte", metodoPago);

    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          metodo_pago: metodoPago,
          cardId: cardId,
          cardLast4: cardLast4,
          cardType: cardType
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateMetodoPagoEfectivo(idx, metodoPago) {
    console.log("Este es el tipo de transporte", metodoPago);

    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          metodo_pago: metodoPago,
          cardId: null,
          cardLast4: null,
          cardType: null
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  _updateMetodoPagoEfectivo(idx, metodoPago, cambio) {
    console.log("Este es el tipo de transporte", metodoPago);

    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          metodo_pago: metodoPago,
          cardId: null,
          cardLast4: null,
          cardType: null,
          cambio: cambio
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateService(idx, numPedidos) {
    var promise = new Promise((resolve, reject) => {
      const uidCliente = localStorage.getItem("uid");
      const timestamp = moment().format("x");
      const clave = moment().toArray();
      console.log(clave[5], clave[6]);
      const segundos = clave[5].toString();
      const milisegundos = clave[6].toString();
      const _clave = segundos + milisegundos;
      console.log("Esta es la clave: ", _clave);

      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          estatus: "Notificando",
          fecha: timestamp,
          enEspera: Number(timestamp),
          clave: _clave,
          numPedidos: Number(numPedidos),
          uidCliente: uidCliente
        })
        .then(() => {
          resolve({success:true});
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateComicion(
    idx,
    corteBme,
    corteRep,
    servicio,
    productos,
    granTotal,
    comision
  ) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          corteBme: corteBme,
          corteRep: corteRep,
          totalServicio: servicio,
          totalProductos: productos,
          totalNeto: granTotal,
          comision: comision
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateEstatus(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          estatus: "Pagado"
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateEstatusCancelado(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          estatus: "Cancelado"
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateStatus(idx, estatus) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          status: estatus
        })
        .then(() => {
          resolve({success: true});
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateStatusTermino(idx, estatus) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .update({
          termino: estatus
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  getServicePQ(collection: string, idx): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(collection)
        .doc(idx)
        .onSnapshot(doc => {
          if (!doc.exists) {
            console.log("No such document!");
            resolve(null);
          } else {
            console.log("Document data:", doc.data());
            resolve(doc.data());
          }
        });
    });
  }

  getOneServicio(idx) {
    this.pedidoDoc = this.dbF.doc<any>(`servicios/${idx}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.pedido = this.pedidoDoc.snapshotChanges().pipe(
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


  getOneService(idx) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(idx)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log("No such document!");
            resolve(null);
          } else {
            console.log("Document data:", doc.data());
            resolve(doc.data());
          }
        })
        .catch(err => {
          console.log("Error getting document", err);
          reject(err);
        });
    });
  }

  getAllServicios(idx) {
    this.servicios = this.dbF.collection<any>("servicios", ref =>
      ref.where("uidCliente", "==", idx).orderBy("fecha", "desc")
    );
    this._servicios = this.servicios.valueChanges();

    return (this._servicios = this.servicios.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getAllServiciosP(idx) {
    this.serviciosP = this.dbF.collection<any>("rutas", ref =>
      ref
        .where("idServicio", "==", idx)
        .where("estatus", "==", 1)
        .orderBy("fecha", "asc")
    );
    this._serviciosP = this.serviciosP.valueChanges();
    return (this._serviciosP = this.serviciosP.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getOnePedido(idx) {
    this.pedidoDoc = this.dbF.doc<any>(`pedidos/${idx}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.pedido = this.pedidoDoc.snapshotChanges().pipe(
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

  getAllPedidosPQ(idx) {
    this.pedidos = this.dbF.collection<any>("pedidos", ref =>
      ref.where("servicioID", "==", idx)
    );
    this._pedidos = this.pedidos.valueChanges();

    return (this._pedidos = this.pedidos.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  _getAllPedidosPQ(idx): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("pedidos")
        .where("servicioID", "==", idx)
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

  getAllProductos(collection: string, pedidoID) {
    this.productos = this.dbF.collection<any>("productos", ref =>
      ref.where("pedidoID", "==", pedidoID)
    );
    this._productos = this.productos.valueChanges();

    return (this._productos = this.productos.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getProducto(idx) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .doc(idx)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log("No such document!");
            resolve(null);
          } else {
            console.log("Document data:", doc.data());
            resolve(doc.data());
          }
        })
        .catch(err => {
          console.log("Error getting document", err);
          reject(err);
        });
    });
  }

  updateProducto(cantidad, nota, _nota, idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .doc(idx)
        .update({
          cantidad: cantidad,
          descripcion: nota,
          producto: _nota
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  deleteProducto(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .doc(idx)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          resolve(true);
        })
        .catch(err => {
          console.error("Error removing document: ", err);
          reject(err);
        });
    });
    return promise;
  }

  deletServicePQ(servicioID, servicioPedido) {
    this.db
      .collection("servicios")
      .doc(servicioID)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });

    const pedidosServ = this.db
      .collection("pedidos")
      .where("servicioID", "==", servicioID);

    pedidosServ.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });

    const pedidosProductServ = this.db
      .collection("productos")
      .where("pedidoID", "==", servicioPedido);

    pedidosProductServ.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  deletServicePedidoPQ(servicioID, servicioPedido) {
    this.db
      .collection("pedidos")
      .doc(servicioPedido)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });

    const pedidosProductServ = this.db
      .collection("productos")
      .where("pedidoID", "==", servicioPedido);

    pedidosProductServ.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  insertarTotales(
    servicioID,
    comision,
    corteBme,
    corteRep,
    totalProductos,
    totalF,
    totalFinal,
    porcentaje
  ) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          comision: comision,
          corteBme: corteBme,
          corteRep: corteRep,
          totalProductos: totalProductos,
          totalServicio: totalF,
          totalNeto: totalFinal,
          porcentaje: porcentaje
        })
        .then(() => {
          resolve({success: true});
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }
}
