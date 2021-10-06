import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import * as firebase from "firebase/app";
import "firebase/firestore";

@Injectable()
export class RegisterUserProvider {
  db = firebase.firestore();
  repartidor: AngularFirestoreDocument<any>;
  userDoc: AngularFirestoreDocument<any[]>;
  user: Observable<any>;
  usuarioF: AngularFirestoreCollection<any[]>;
  _usuarioF: Observable<any>;

  constructor(
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public fdb: AngularFirestore
  ) {
    console.log("Hello RegisterUserProvider Provider");
  }

  register(perfil, id) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("users")
        .doc(id)
        .update({
          username: perfil.username,
          lastname: perfil.lastname,
          phone: perfil.phone,
          email: perfil.email,
          terminos: perfil.terminos,
          uidSucursal: perfil.location,
        })
        .then(function () {
          console.log("Document written with ID: ", id);
          localStorage.setItem("uidSucursal", perfil.location);
          resolve({ success: true });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  updateUserPerfil(uid: any, perfil: any) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("users")
        .doc(uid)
        .update({
          username: perfil.username,
          lastname: perfil.lastname,
          phone: perfil.phone
          // email: perfil.email,
        })
        .then(function () {
          console.log("Document update with ID: ", uid);
          resolve({ success: true });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
          reject(JSON.stringify(error));
        });
    });
  }

  idOneSignal(idx, playerID) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("users")
        .doc(idx)
        .update({
          playerID: playerID,
        })
        .then(function () {
          console.log("Document written with ID: ", idx);
          resolve({ success: true });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  ubicacionReparidor(uid) {
    this.repartidor = this.fdb.doc(`/users/${uid}`);
  }

  registerWithFacebookWeb(user) {
    return new Promise((resolve, reject) => {
      console.log(user.user.uid);
      let id = user.user.uid;

      this.db
        .collection("users")
        .doc(id)
        .set({
          username: user.additionalUserInfo.profile.first_name,
          lastname: user.additionalUserInfo.profile.last_name,
          email: user.additionalUserInfo.profile.email,
          phone: user.user.phoneNumber,
          photo: user.user.photoURL,
          activo: true,
          uid: id,
          tipo: 4,
        })
        .then(function () {
          console.log("Document written with ID: ", id);
          resolve({ success: true, uid: id });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  registerWithFacebookMovil(user, fb_id) {
    return new Promise((resolve, reject) => {
      const us = user;

      const displayName = us.name,
        username = displayName.split(" ")[0];
      const displayName_ = us.name,
        lastname = displayName_.split(" ")[1];

      const id = localStorage.getItem("uid");
      const locationData = new firebase.firestore.GeoPoint(
        22.1126598,
        -101.0961555
      );

      this.db
        .collection("users")
        .doc(id)
        .set({
          username: username,
          lastname: lastname,
          email: us.email,
          photo: us.picture_large.data.url,
          activo: true,
          uid: id,
          tipo: 4,
          idFacebook: fb_id,
          ubicacion: locationData,
        })
        .then(function () {
          console.log("Document written with ID: ", id);
          resolve({ success: true, uid: id });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  registerWithGoogle(user) {
    return new Promise((resolve, reject) => {
      console.log("ID usuario" + JSON.stringify(user.user.uid));

      const us = user.user;
      let displayName = us.displayName,
        username = displayName.split(" ")[0];
      let displayName_ = us.displayName,
        lastname = displayName_.split(" ")[1];
      let id = us.uid;

      this.db
        .collection("users")
        .doc(id)
        .set({
          username: username,
          lastname: lastname,
          email: us.email,
          phone: us.phoneNumber,
          photo: us.photoURL,
          activo: true,
          uid: id,
          tipo: 4,
        })
        .then(function () {
          console.log("Document written with ID: ", id);
          resolve({ success: true, uid: id });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  registerWithPhone(user) {
    return new Promise((resolve, reject) => {
      console.log("usuario", user);

      const us = user;
      //Extraer numero
      const cadena = us.phoneNumber,
        phoneNumber = cadena.substring(3, 13);
      const id = us.uid;

      this.db
        .collection("users")
        .doc(id)
        .set({
          username: null,
          lastname: null,
          email: us.email,
          phone: phoneNumber,
          photo: us.photoURL,
          activo: true,
          uid: id,
          tipo: 4,
        })
        .then(function () {
          console.log("Document written with ID: ", id);
          resolve({ success: true, uid: id });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  _getUser(idx) {
    this.userDoc = this.fdb.doc<any>(`users/${idx}`);

    return (this.user = this.userDoc.snapshotChanges().pipe(
      map((action) => {
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

  getUserFacebook(idx) {
    this.usuarioF = this.fdb.collection<any>("users", (ref) =>
      ref.where("idFacebook", "==", idx)
    );
    this._usuarioF = this.usuarioF.valueChanges();

    return (this._usuarioF = this.usuarioF.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getUser(idx) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("users")
        .doc(idx)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log("No such document!");
            resolve(null);
          } else {
            // console.log("Document data:", doc.data());
            resolve(doc.data());
          }
        })
        .catch((err) => {
          console.log("Error getting document", err);
          reject(err);
        });
    });
  }

  insertUID(uid) {
    return new Promise((resolve, reject) => {
      const locationData = new firebase.firestore.GeoPoint(
        22.1126598,
        -101.0961555
      );
      this.db
        .collection("users")
        .doc(uid)
        .set({
          photo:
            "https://firebasestorage.googleapis.com/v0/b/bringme-a412b.appspot.com/o/repartidor%2Fprofile_xxy6gfot57?alt=media&token=577d55b5-d334-4940-aa9e-2117b0254b24",
          uid: uid,
          ubicacion: locationData,
          tipo: 4,
          activo: true,
        })
        .then(function () {
          console.log("Document written with ID: ", uid);
          resolve({ success: true, uid: uid });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  getAllDocuments(collection: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(collection)
        .get()
        .then((querySnapshot) => {
          let arr = [];
          querySnapshot.forEach(function (doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            // console.log("Document data:", arr);
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
  
  getAllRepas(collection: string, uidSucursal: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(collection)
        .where("tipo", "==", 2)
        .where("uidSucursal", "==", uidSucursal)
        .where("activo", "==", true)
        .get()
        .then((querySnapshot) => {
          let arr = [];
          querySnapshot.forEach(function (doc) {
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
}
