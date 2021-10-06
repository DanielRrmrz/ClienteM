import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage";
import { Geolocation } from "@ionic-native/geolocation";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { AngularFireAuth } from "angularfire2/auth";

import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Platform } from "ionic-angular";

@Injectable()
export class UbicacionProvider {
  usuario: AngularFirestoreDocument<any>;
  uid: any;
  lat: any;
  lng: any;
  constructor(
    public geolocation: Geolocation,
    public afireauth: AngularFireAuth,
    public db: AngularFirestore,
    public afiredatabase: AngularFireDatabase,
    public nativeStorage: NativeStorage,
    public platform: Platform
  ) {
    console.log("Hello UbicacionProvider Provider");
    if (this.platform.is("")) {
      this.uid = this.nativeStorage.getItem("uid");
    } else {
      this.uid = localStorage.getItem("uid");
    }
    console.log(this.uid);

    this.usuario = db.doc(`/users/${this.uid}`);
  }

  iniciarGeolocalizacion() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        // resp.coords.latitude
        // resp.coords.longitude
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;

        if (this.platform.is("")) {
          this.nativeStorage.setItem("lat", String(lat));
          this.nativeStorage.setItem("lng", String(lng));
        } else {
          localStorage.setItem("lat", String(lat));
          localStorage.setItem("lng", String(lng));
        }
        const locationData = new firebase.firestore.GeoPoint(
          resp.coords.latitude,
          resp.coords.longitude
        );
        if (localStorage.getItem('LoginPage') == 'true') {
          this.usuario.update({
            ubicacion: locationData
          });
        }

        console.log(resp.coords);
        let watch = this.geolocation.watchPosition();
        watch.subscribe(data => {
          // data can be a set of coordinates, or an error (if an error occurred).
          // data.coords.latitude
          // data.coords.longitude
          let lat = data.coords.latitude;
          let lng = data.coords.longitude;
          if (this.platform.is("")) {
            this.nativeStorage.setItem("lat", String(lat));
            this.nativeStorage.setItem("lng", String(lng));
          } else {
            localStorage.setItem("lat", String(lat));
            localStorage.setItem("lng", String(lng));
          }

          const locationData = new firebase.firestore.GeoPoint(
            data.coords.latitude,
            data.coords.longitude
          );
          if (localStorage.getItem('LoginPage') == 'true') {
            this.usuario.update({
              ubicacion: locationData
            });
          }
          // console.log("watch:", data.coords);
        });
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  _iniciarGeolocalizacion() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        // resp.coords.latitude
        // resp.coords.longitude
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;
        if (this.platform.is("")) {
          this.nativeStorage.setItem("lat", String(lat));
          this.nativeStorage.setItem("lng", String(lng));
        } else {
          localStorage.setItem("lat", String(lat));
          localStorage.setItem("lng", String(lng));
        }
        const locationData = new firebase.firestore.GeoPoint(
          resp.coords.latitude,
          resp.coords.longitude
        );
        this.usuario.set({
          ubicacion: locationData
        });

        console.log(resp.coords);
        let watch = this.geolocation.watchPosition();
        watch.subscribe(data => {
          // data can be a set of coordinates, or an error (if an error occurred).
          // data.coords.latitude
          // data.coords.longitude
          let lat = data.coords.latitude;
          let lng = data.coords.longitude;
          if (this.platform.is("")) {
            this.nativeStorage.setItem("lat", String(lat));
            this.nativeStorage.setItem("lng", String(lng));
          } else {
            localStorage.setItem("lat", String(lat));
            localStorage.setItem("lng", String(lng));
          }
          const locationData = new firebase.firestore.GeoPoint(
            data.coords.latitude,
            data.coords.longitude
          );
          this.usuario.set({
            ubicacion: locationData
          });
          // console.log("watch:", data.coords);
        });
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }
}
