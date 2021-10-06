import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  MenuController,
  LoadingController
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { RegisterUserProvider } from '../../providers/register-user/register-user';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-login-email",
  templateUrl: "login-email.html"
})
export class LoginEmailPage {
  email: any = "";
  password: any = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public menu: MenuController,
    public firebase: AngularFireAuth,
    public _userProvider: RegisterUserProvider,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService
  ) {
    this.menu.enable(false); // Enable sidemenu
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginEmailPage");
  }
  iniciarSesion() {
    let content = this.translateService.instant('LOGIN_EMAIL.LOGGIN');
    const loader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: content
    });
    loader.present();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(user => {
        // alert(JSON.stringify(user));
        this._userProvider._getUser(user.user.uid).subscribe(_user => {
          console.log("usuario: ", _user);
          console.log("Ubicacion: ", _user.ubicacion);
          const lat = _user.ubicacion._lat;
          const long = _user.ubicacion._long;
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("uid", user.user.uid);
          if (lat != undefined && long != undefined) {
            localStorage.setItem("lat", _user.ubicacion._lat);
            localStorage.setItem("lng", _user.ubicacion._long);
          } else {
            localStorage.setItem("lat", "22.1126598");
            localStorage.setItem("lng", "-101.0961555");
          }
          localStorage.setItem("uidSucursal", _user.uidSucursal);
          localStorage.setItem("LoginPage", "true");
          localStorage.setItem("datos", "true");
          localStorage.setItem("anonimo", "false");//TIbeAnonimo
          console.log("Datos localstorage: ",localStorage.getItem("datos"));
          this.navCtrl.setRoot("HomePage");
          setTimeout(() => {
            loader.dismiss();
          }, 3000);
        });
      })
      .catch((error: any) => {
        // Handle Errors here.
        const errorCode = error.code;
        // alert(errorCode);
        if (errorCode == "auth/wrong-password") {
          let msj = this.translateService.instant('LOGIN_EMAIL.ICRPASS');
          const mensaje = msj;
          setTimeout(() => {
            loader.dismiss();
          }, 3000);
          this.mensaje(mensaje);
        } else if (errorCode == "auth/invalid-email") {
          let msj = this.translateService.instant('LOGIN_EMAIL.INVALIDEMAIL');
          const mensaje = msj;
          setTimeout(() => {
            loader.dismiss();
          }, 3000);
          this.mensaje(mensaje);
        } else if (errorCode == "auth/user-not-found") {
          let msj = this.translateService.instant('LOGIN_EMAIL.USERNOTFOUND');
          const mensaje = msj;
          setTimeout(() => {
            loader.dismiss();
          }, 3000);
          this.mensaje(mensaje);
        }
        // ...
      });
  }

  restPass() {
    const auth = firebase.auth();
    const emailAddress = this.email;
    
    auth.sendPasswordResetEmail(emailAddress).then(() => {
      let msj = this.translateService.instant('LOGIN_EMAIL.PASSWORDRESET');
      const mensaje = msj;   
      this.mensaje(mensaje);
    }).catch((error) => {
      console.log('Error: ', error);
      const mensaje = "";   
      this.mensaje(mensaje);
    });
  }

  mensaje(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      position: "top",
      duration: 6000
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
  
  goToResetPass() {
    this.navCtrl.setRoot("ResetPasswordPage");
  }

  cerrarModal() {
    this.navCtrl.setRoot("FirstLandingPage");
  }

}
