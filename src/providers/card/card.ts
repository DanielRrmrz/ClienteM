import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import * as firebase from "firebase/app";
import * as moment from "moment";


@Injectable()
export class CardProvider {
  db = firebase.firestore();
  cards: AngularFirestoreCollection<any[]>;
  _cards: Observable<any>;
  card: AngularFirestoreDocument<any[]>;
  _card: Observable<any>;
  constructor(public dbF: AngularFirestore) {}

  cardRegistrar(card) {
    return new Promise((resolve, reject) => {
      const timestamp = moment().format("x");
      const uid = localStorage.getItem("uid");
      console.log(JSON.stringify(card), " ", timestamp, " ", uid);
      const cardType = card.cardType;
      const cardLast4 = card.cardLast4;
      const number = card.number;
      const expMonth = card.expMonth;
      const expYear = card.expYear;
      const cvc = card.cvc;
      this.db
        .collection("card")
        .add({
          uidCliente: uid,
          fecha: timestamp,
          cardType: cardType,
          cardLast4: cardLast4,
          number: number,
          expMonth: expMonth,
          expYear: expYear,
          cvc: cvc
        })
        .then(docRef => {
          console.log("Document successfully written!", docRef.id);
          this.updateCardKey(docRef.id);
          resolve({ success: true, cardKey: docRef.id });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  getAllCards(collection: string, idx) {
    this.cards = this.dbF.collection<any>(collection, ref =>
      ref.where("uidCliente", "==", idx)
    );
    this._cards = this.cards.valueChanges();

    return (this._cards = this.cards.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  updateCardKey(id) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("card")
        .doc(id)
        .update({
          cardID: id
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

  updateCheked(key, cardID, metodoPago) {
    console.log(metodoPago);

    console.log(key, cardID, metodoPago);

    if (key != "" && metodoPago == "Tarjeta") {
      var promise = new Promise((resolve, reject) => {
        this.db
          .collection("card")
          .doc(key)
          .update({
            checked: true
          })
          .then(() => {
            resolve(true);
            console.log("Echo 1", cardID, " ", key);
            if (key != cardID && cardID != null) {
              this.updateChekedFalse(cardID);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
      return promise;
    } else if (metodoPago == "Efectivo") {
      this.updateChekedEfectivo(cardID);
    }
  }

  updateChekedFalse(cardID) {
    var _promise = new Promise((resolve, reject) => {
      this.db
        .collection("card")
        .doc(cardID)
        .update({
          checked: false
        })
        .then(() => {
          resolve(true);
          console.log("Echo 2");
        })
        .catch(err => {
          reject(err);
        });
    });
    return _promise;
  }

  updateChekedEfectivo(cardID) {
    if (cardID != null) {
      var promise_ = new Promise((resolve, reject) => {
        this.db
          .collection("card")
          .doc(cardID)
          .update({
            checked: false
          })
          .then(() => {
            resolve(true);
            console.log("Echo 3");
          })
          .catch(err => {
            reject(err);
          });
      });
      return promise_;
    } else {
      console.log("El ID esta basio");
    }
  }

  getOneCard(idx) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("card")
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

  
}
