import { Component } from "@angular/core"; ///Pantalla deshabilitada
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  MenuController,
  App,
  ModalController,
  LoadingController
} from "ionic-angular";
import { Platform } from "ionic-angular";

//Redes Sociales
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
// import { GooglePlus } from "@ionic-native/google-plus";

//Firebase
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";

//Provider
import { RegisterUserProvider } from "../../providers/register-user/register-user";
import { Storage } from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  usuarioF: any;
  CONECT: string;
  ERRCONECT: string;
  TRY: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadinCtl: LoadingController,
    private menu: MenuController,
    private fb: Facebook,
    // private googlePlus: GooglePlus,
    private platform: Platform,
    private afAuth: AngularFireAuth,
    public userProvider: RegisterUserProvider,
    public app: App,
    public storage: Storage,
    public translateService: TranslateService
  ) {
    this.menu.enable(false); // Enable sidemenu
    this.CONECT = translateService.instant('LOGIN.CONECT');
    this.ERRCONECT = translateService.instant('LOGIN.ERRCONECT');
    this.TRY = translateService.instant('LOGIN.TRY');
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
    const tipo = this.navParams.get("tipo");
    const phoneNumber = this.navParams.get("phoneNumber");
    if (tipo == "phone") {
      this.navCtrl.setRoot("LoginPhonePage", {
        phoneNumber: phoneNumber
      });
    }
  }
  cerrarModal() {
    this.navCtrl.setRoot("LoginRegistroPage");
  }
  signInWithFacebook() {
    if (this.platform.is("cordova")) {
      let loading = this.loadinCtl.create({
        spinner: "bubbles",
        content: this.CONECT
      });

      loading.present();
      this.fb
        .login(["public_profile", "email"])
        .then((res: FacebookLoginResponse) => {
          // The connection was successful
          if (res.status == "connected") {
            // Get user ID and Token
            var fb_id = res.authResponse.userID;
            // Get user infos from the API
            this.fb
              .api(
                "me?fields=id,name,email,picture.width(720).height(720).as(picture_large)",
                []
              )
              .then(user => {
                // console.log(JSON.stringify(user));
                // Get the connected user details
                this.userProvider
                  .registerWithFacebookMovil(user, fb_id)
                  .then((res: any) => {
                    if (res.success == true) {
                      localStorage.setItem("LoginPage", "true");
                      this.navCtrl.setRoot("UserInformationPage");
                      setTimeout(() => {
                        loading.dismiss();
                      }, 1000);
                    }
                  });


                // => Open user session and redirect to the next page
              });
          }
          // An error occurred while loging-in
          else {
            console.log("An error occurred...");
          }
        })
        .catch(error => {
          console.log(error);
          alert("Errores:" + JSON.stringify(error));
          this.alertCtrl
            .create({
              title: this.ERRCONECT,
              subTitle: this.TRY,
              buttons: ["Aceptar"]
            })
            .present();
          setTimeout(() => {
            loading.dismiss();
          }, 1000);
        });
    } else {
      let loading = this.loadinCtl.create({
        spinner: "bubbles",
        content: this.CONECT
      });

      loading.present();

      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          this.userProvider
            .registerWithFacebookWeb(res)
            .then((res: any) => {
              localStorage.setItem("isLogin", "true");
              localStorage.setItem("uid", res.uid);
              localStorage.removeItem("anonimo");
              this.navCtrl.setRoot("UserInformationPage");
              setTimeout(() => {
                loading.dismiss();
              }, 1000);
              console.log("Esta es la respuesta" + JSON.stringify(res));
            })
            .catch(err => {
              this.alertCtrl
                .create({
                  title: this.ERRCONECT,
                  subTitle: this.TRY,
                  buttons: ["Aceptar"]
                })
                .present();
              setTimeout(() => {
                loading.dismiss();
              }, 1000);
            });
        });
    }
  }

  // signInWithGoogle() {
  //   let loading = this.loadinCtl.create({
  //     spinner: "bubbles",
  //     content: this.CONECT
  //   });

  //   loading.present();
  //   this.googlePlus
  //     .login({
  //       webClientId:
  //         "697961749658-kurtgtevs7hulie7fknkbgg7r6ti3j0b.apps.googleusercontent.com",
  //       offline: true
  //     })
  //     .then(res => {
  //       firebase
  //         .auth()
  //         .signInWithCredential(
  //           firebase.auth.GoogleAuthProvider.credential(res.idToken)
  //         )
  //         .then(user => {
  //           console.log("Firebase success: " + JSON.stringify(user));
  //           this.userProvider
  //             .registerWithGoogle(user)
  //             .then((res: any) => {
  //               if (this.platform.is("")) {
  //                 this.storage.set("isLogin", "true");
  //                 this.storage.set("uid", res.uid);
  //                 this.storage.remove("anonimo");
  //               } else {
  //                 localStorage.setItem("isLogin", "true");
  //                 localStorage.setItem("uid", res.uid);
  //                 localStorage.removeItem("anonimo");
  //               }

  //               this.navCtrl.setRoot("UserInformationPage");
  //               setTimeout(() => {
  //                 loading.dismiss();
  //               }, 1000);
  //             })
  //             .catch(err => {
  //               this.alertCtrl
  //                 .create({
  //                   title: this.ERRCONECT,
  //                   subTitle: this.TRY,
  //                   buttons: ["Aceptar"]
  //                 })
  //                 .present();
  //               setTimeout(() => {
  //                 loading.dismiss();
  //               }, 1000);
  //             });
  //         })
  //         .catch(error => alert("Firebase failure: " + JSON.stringify(error)));
  //     })
  //     .catch(err => alert("Error: " + JSON.stringify(err)));
  // }

  goPhoneNumber() {
    this.navCtrl.setRoot("LoginPhonePage");
  }

  Guest() {
    firebase.auth().signInAnonymously();

    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      let loading = this.loadinCtl.create({
        spinner: "bubbles",
        content: this.CONECT
      });
      if (user) {
        // User is signed in.

        if (user) {
          // User is signed in.
          let isAnonymous = String(user.isAnonymous);
          let uid = user.uid;
          console.log("isAnonymous: ", isAnonymous);
          console.log("uid: ", uid);
          if (this.platform.is("")) {
            this.storage.set("isLogin", "true");
            this.storage.set("uid", uid);
            this.storage.set("anonimo", "true");
            this.storage.set("uidSucursal", "6tjoroOWYYIH2IEWZN7g");
          } else {
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("uid", uid);
            localStorage.setItem("anonimo", "true");
            localStorage.setItem("uidSucursal", "6tjoroOWYYIH2IEWZN7g");
          }

          this.navCtrl.setRoot("HomePage");
          setTimeout(() => {
            loading.dismiss();
          }, 1000);
          // ...
        } else {
          this.alertCtrl
            .create({
              title: this.ERRCONECT,
              subTitle: this.TRY,
              buttons: ["Aceptar"]
            })
            .present();
          setTimeout(() => {
            loading.dismiss();
          }, 1000);
        }
        // ...
      } else {
        // User is signed out.
        // ...
      }
      // ...
    });
  }
  
  continuar(){
    // const uid = localStorage.getItem("uid");
    // this.userProvider.insertUID(uid).then((res: any) => {
    //   if (res.success == true) {
    //     localStorage.setItem("LoginPage", "true");
       
    //   }
    // });
    //mover funcion a la pantalla donde se piden los datos
     this.navCtrl.setRoot("LoginRegistroPage");
  }
}
