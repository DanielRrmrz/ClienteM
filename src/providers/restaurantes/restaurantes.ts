import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { RegisterUserProvider } from '../register-user/register-user';

@Injectable()
export class RestaurantesProvider {
  db = firebase.firestore();
  menu: AngularFirestoreCollection<any[]>;
  _menu: Observable<any>;
  nombreUsuario: any;
  constructor(
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public dbF: AngularFirestore,
    public userProvider: RegisterUserProvider
  ) {
    console.log("Hello RestaurantesProvider Provider");
    const uid = localStorage.getItem("uid");
      this.userProvider._getUser(uid).subscribe(user => {
        this.nombreUsuario = user.username + ' ' + user.lastname;
        console.log('Usuario', this.nombreUsuario);
      });
  }

  getAllRestaurantes(
    collection: string,
    uidSucursal,
    uidCategoria: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(collection)
        .where("tipo", "==", 3)
        .where("uidSucursal", "==", uidSucursal)
        .where("uidCategoria", "==", uidCategoria)
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

  getAllMenu(uid) {
    this.menu = this.dbF.collection<any>("menus", ref =>
      ref
        .where("userUid", "==", uid)
        .where("estado", "==", "1")
        .orderBy("time")
        .orderBy("fecha")
    );
    this._menu = this.menu.valueChanges();

    return (this._menu = this.menu.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getRestaurante(uid) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("users")
        .doc(uid)
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

  getDetallesProducto(uid) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("menus")
        .doc(uid)
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

  //////Aquí inician las funciones para insersión del carrito en base de Datos
  saveServiceRES(restauranteId) {
    return new Promise((resolve, reject) => {
      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");
      const locationData = new firebase.firestore.GeoPoint(
        parseFloat(lat),
        parseFloat(lng)
      );
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const direEnd = localStorage.getItem("direEnd");
      const uidSucursal = localStorage.getItem("uidSucursal");
      const playerID = localStorage.getItem("playerID");      
      const uid = localStorage.getItem("uid");
      this.db
        .collection("servicios")
        .add({
          clave: "#",
          estatus: "creando",
          fecha: timestamp,
          entregaGeo: locationData,
          entregaDir: direEnd,
          uidCliente: uid,
          tipo: 2,
          comisionServicio: "",
          costoServicio: "",
          costoTotal: "",
          metodo_pago: "Efectivo",
          tiempoServicio: "",
          tipoTrasporte: "",
          uid: "",
          uidRestaurante: restauranteId,
          numTikets: 0,
          abierto: null,
          uidSucursal: uidSucursal,
          playerIDUser: playerID,
          nombreUsuario: this.nombreUsuario
        })
        .then(docRef => {
          console.log("Document successfully written!", docRef.id);
          localStorage.setItem("servicioID", docRef.id);
          this.updateServiceIDX(docRef.id);
          resolve({ success: true, servicioID: docRef.id });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  savePedidoRES(servicioID, pedido) {
    console.log("Informacion: ", pedido);
    return new Promise((resolve, reject) => {
      const locationData = new firebase.firestore.GeoPoint(
        pedido.latPedido,
        pedido.lngPedido
      );
      this.db
        .collection("pedidos")
        .add({
          servicioID: servicioID,
          pedidoGeo: locationData,
          nombreLocal: pedido.placeName,
          direccionLocal: pedido.placeDire
        })
        .then(function(docRef) {
          console.log("Document successfully written!", docRef.id);
          localStorage.setItem("pedidoID", docRef.id);
          resolve({ success: true });
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

  saveServiceProductRES(producto, pedidoID, servicioID) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .add({
          cantidad: producto.cantidad,
          descripcion: producto.descripcion,
          productoID: producto.productoID,
          total: producto.total,
          nota: producto.nota,
          estatus: false,
          pedidoID: pedidoID,
          servicioID: servicioID,
        })

        .then(function(docRef) {
          console.log("Document successfully written!", docRef.id);
          resolve({ success: true });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
          resolve({ success: false });
        });
    });
  }

  getAllProducts(pedidoID: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .where("pedidoID", "==", pedidoID)
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

  updateProducto(cantidad, idc) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .doc(idc)
        .update({
          cantidad: cantidad
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

  deleteProducto(idc) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .doc(idc)
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

  deleteAllProducts(servicioID, pedidoID) {
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
      .where("pedidoID", "==", pedidoID);

    pedidosProductServ.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  deleteServicio(servicio) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicio)
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
}
