import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";
import { map } from "rxjs/operators/map";
import { Observable } from "rxjs/Observable";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
  service: any
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}
@Injectable()
export class ChatServiceProvider {
  msg: AngularFirestoreCollection<any[]>;
  _msg: Observable<any>;
  constructor(
    private events: Events,
    public dbF: AngularFirestore
  ) {
    console.log("Hello ChatServiceProvider Provider");
  }

  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: "210000198410281948",
      userName: "Hancock",
      userAvatar: "./assets/to-user.jpg",
      toUserId: "140000198202211138",
      time: Date.now(),
      message: msg.message,
      status: "success",
      service: 'serviceID'
    };

    setTimeout(() => {
      this.events.publish("chat:received", mockMsg, Date.now());
    }, Math.random() * 1800);
  }

  // getMsgList(): Observable<ChatMessage[]> {
  //   const msgListUrl = "./assets/mock/msg-list.json";
  //   return this.http.get<any>(msgListUrl).pipe(map(response => response.array));
  // }

  getMsgList(idx) {
    this.msg = this.dbF.collection<any>("chat", ref =>
      ref.where("service", "==", idx).orderBy('time').orderBy('messageId'));
    this._msg = this.msg.valueChanges();

    return (this._msg = this.msg.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  sendMsg(msg: ChatMessage) {
    return new Promise(resolve =>
      setTimeout(() => resolve(msg), Math.random() * 1000)
    ).then(() => this.mockNewMsg(msg));
  }

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      id: "140000198202211138",
      name: "Luff",
      avatar: "./assets/user.jpg"
    };
    return new Promise(resolve => resolve(userInfo));
  }

  saveMsg(newMsg) {
    return new Promise((resolve, reject) => {
      this.dbF
        .collection("chat")
        .add({
          messageId: newMsg.messageId,
          userId: newMsg.userId,
          userName: newMsg.userName,
          userAvatar: newMsg.userAvatar,
          toUserId: newMsg.toUserId,
          time: newMsg.time,
          message: newMsg.message,
          status: newMsg.status,
          service: newMsg.service
        })
        .then(docRef => {
          console.log("Document successfully written!", docRef.id);
          resolve({ success: true, servicioID: docRef.id });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }
}
