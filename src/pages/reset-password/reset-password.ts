import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-reset-password",
  templateUrl: "reset-password.html",
})
export class ResetPasswordPage {
  email: any = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public firebase: AngularFireAuth,
    public alertCtrl: AlertController,
    public translateService: TranslateService
  ) {
    this.menu.enable(false); // Enable sidemenu
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ResetPasswordPage");
  }

  backTOLoginEmail() {
    this.navCtrl.setRoot("FirstLandingPage");
  }

  restPass() {
    const auth = firebase.auth();
    const emailAddress = this.email;

    auth
      .sendPasswordResetEmail(emailAddress)
      .then(() => {
        let msj = this.translateService.instant("LOGIN_EMAIL.PASSWORDRESET");
        const mensaje = msj;
        this.mensaje(mensaje);
      })
      .catch((error) => {
        console.log("Error: ", error);
        const mensaje = "";
        this.mensaje(mensaje);
      });
  }

  mensaje(mensaje: string) {
    let ok = this.translateService.instant('RESETPASS.OK');
    const alert = this.alertCtrl.create({
      title: mensaje,
      buttons: [{
        text: ok,
        handler: data => {
          console.log('Saved clicked');
        }}]
    });
    alert.present();
  }
}
