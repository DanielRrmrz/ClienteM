import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform, AlertController } from 'ionic-angular';
import { RegisterUserProvider } from '../register-user/register-user';

@Injectable()
export class PushProvider {
  constructor(public alertCtrl: AlertController, public oneSignal: OneSignal, public platform: Platform, public _prividerRegUser: RegisterUserProvider) {
    console.log("Hello PushProvider Provider");
  }

  init_notification() {
    if (this.platform.is("cordova")) {
      this.oneSignal.startInit(
        "d8805e05-35c0-4036-99a5-2b4b493262b2",
        "901139849089"
      );

      this.oneSignal.enableSound(true);

      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.Notification
      );

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
        console.log("Notificacion recibida");
      });

      this.oneSignal.handleNotificationOpened().subscribe(jsonData => {
        // do something when a notification is opened
        const estatus = jsonData.notification.payload.additionalData.estatus;
        if (estatus == "Mostrar") {
          let oneSignal = this.alertCtrl.create({
            title: jsonData.notification.payload.title,
            subTitle: jsonData.notification.payload.body,
            buttons: ["Aceptar"]
          });
          oneSignal.present();
        }
        // alert("Notificacion abierta " + JSON.stringify(jsonData.notification.payload.additionalData.estatus));
      });

      this.oneSignal.endInit();
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  get_id(){
    if (this.platform.is('cordova')) {
      this.oneSignal.getIds().then(data => {
        // alert('Data :' + JSON.stringify(data));
        const uidUser = localStorage.getItem("uid");
        const playerID = data.userId;
        this._prividerRegUser.idOneSignal(uidUser, playerID);
        localStorage.setItem("playerID", playerID);
      }); 
    }else{
      console.log('Get ID OneSignal no funciona en web');
    }
  }

  mensaje() {
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "8676873f-a3cd-4f4f-8ac6-6d641ae50194",
        include_player_ids: ["59b036cd-5df5-480c-9a36-4ec00f06678a"],
        data: { foo: "bar" },
        contents: {
          en: "Lo quieres, lo pides, lo tienes."
        },
        headings: { en: "¡Bienvenido ha TOCTOC!" }
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function(successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function(failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }
}
