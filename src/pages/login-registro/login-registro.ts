import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  MenuController,
  LoadingController,
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { TranslateService } from "@ngx-translate/core";
//Provider
import { RegisterUserProvider } from "../../providers/register-user/register-user";//Tibe
@IonicPage()
@Component({
  selector: "page-login-registro",
  templateUrl: "login-registro.html",
})
export class LoginRegistroPage {
  user: any = "";
  password: any = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public firebase: AngularFireAuth,
    public menu: MenuController,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
    public userProvider: RegisterUserProvider
  ) {
    this.menu.enable(false); // Enable sidemenu
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginRegistroPage");
  }
  emailRegistro() {
    if (this.user != "" && this.password != "") {
      var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (!regex.test(this.user)) {
        console.log("Incorrecto");
        const msj = this.translateService.instant("LOGIN_REGISTRO.EMAILIRT");
        const mensaje = msj;
        this.mensaje(mensaje);
      } else {
        console.log("Correcto");
        const content = this.translateService.instant("LOGIN_REGISTRO.NEWUSER");
        const loader = this.loadingCtrl.create({
          spinner: "bubbles",
          content: content,
        });
        loader.present();
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.user, this.password)
          .then((user: any) => {
            // alert(JSON.stringify(user.user));
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("uid", user.user.uid);
            localStorage.setItem("email", user.user.email);
            localStorage.setItem("lat", "22.1126598");
            localStorage.setItem("lng", "-101.0961555");
            this.continuar();//Tibe
            this.navCtrl.setRoot("UserInformationPage");
            setTimeout(() => {
              loader.dismiss();
            }, 3000);
          
          })
          .catch((error: any) => {
            const errorCode = error.code;
            // alert(error);
            if (errorCode == "auth/email-already-in-use") {
              const msj = this.translateService.instant(
                "LOGIN_REGISTRO.EMAILREGISTER"
              );
              const mensaje = msj;
              this.mensaje(mensaje);
              setTimeout(() => {
                loader.dismiss();
              }, 3000);
            } else if (
              error == "Error: Password should be at least 6 characters"
            ) {
              const msj = this.translateService.instant(
                "LOGIN_REGISTRO.PASSWORDSIX"
              );
              const mensaje = msj;
              this.mensaje(mensaje);
              setTimeout(() => {
                loader.dismiss();
              }, 3000);
            }
          });
      }
      
    } else {
      const msj = this.translateService.instant("LOGIN_REGISTRO.REQUIRED");
      const mensaje = msj;
      this.mensaje(mensaje);
    }
  }
  cerrarModal() {
    this.navCtrl.setRoot("FirstLandingPage");
  }
  mensaje(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      position: "top",
      duration: 5000,
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
  continuar(){//Tibe
    const uid = localStorage.getItem("uid");
    this.userProvider.insertUID(uid).then((res: any) => {
      if (res.success == true) {
        localStorage.setItem("LoginPage", "true");       
      }
    });
    //mover funcion a la pantalla donde se piden los datos
     
  }
}
