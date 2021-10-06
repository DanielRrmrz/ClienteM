import { Component, ViewChild,OnInit } from "@angular/core";
import {
  Nav,
  Platform,
  App,
  AlertController,
  MenuController,
  ModalController,
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { NativeStorage } from "@ionic-native/native-storage";
import { timer } from "rxjs/observable/timer";
//import { FirstLandingPage } from "../pages/first-landing/first-landing";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { AngularFireAuth } from "angularfire2/auth";
import { Geolocation } from "@ionic-native/geolocation";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { UbicacionProvider } from "../providers/ubicacion/ubicacion";
import { RegisterUserProvider } from "../providers/register-user/register-user";
import { PushProvider } from "../providers/push/push";
import { SettingsProvider } from "../providers/settings/settings";
import { AppVersion } from "@ionic-native/app-version";
import { ModalVersionAppPage } from "../pages/modal-version-app/modal-version-app";
import { EmailComposer } from '@ionic-native/email-composer';
import { TerminosPage } from "../pages/terminos/terminos";
@Component({
  templateUrl: "app.html",
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ NAME: string; COMPONENT: any; ICON: string }>;

  showSplash = true;

  isLogin: any;

  restaurante: any;

  idUser: any;

  usuario: any;

  banners: any;

  _versionIOS: string = "Gjh9kkL7C63guwsKpykX";
  _versionAndroid: string = "ndqdCRi9htUCV8AhMjlr";
  _enRevision: string = "loS7LpXlErztBk1kj8ff"

  AppV: any;

  anonimo : any;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translateService: TranslateService,
    public http: HttpClient,
    public app: App,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public storage: NativeStorage,
    private appVersion: AppVersion,
    public menuCtrl: MenuController,
    public authFire: AngularFireAuth,
    private screenOrientation: ScreenOrientation,
    public geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy,
    public emailComposer: EmailComposer,
    public _ubicacionProv: UbicacionProvider,
    public userProv: RegisterUserProvider,
    public _pushProvider: PushProvider,
    public _providerSettings: SettingsProvider,
    
  ) {
    this.initializeApp();
    // this.openAppVersion();
    // Default Language
    const lang = localStorage.getItem("idioma");
    if (lang == "es") {
      translateService.setDefaultLang("es");
    } else if (lang == "en") {
      translateService.setDefaultLang("en");
    } else {
      translateService.setDefaultLang("es");
    }
    
    this.isLogin = localStorage.getItem("isLogin");
    this.restaurante = localStorage.getItem("pedidoRes");
    this.idUser = localStorage.getItem("uid");
    console.log("Este es el uid: ", this.idUser);
    this.anonimo = localStorage.getItem("anonimo");
    console.log('Imprimiendo anonimo',this.anonimo)
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.getSidebarList();

      this._providerSettings.getEnRevision(this._enRevision).subscribe((r: any) => {
        console.log('r', r.valor);
        if (r.valor == true) {
          if (this.platform.is('ios')) {
            this.versionApp(this._versionIOS);
          } else if(this.platform.is('android')) {
            this.versionApp(this._versionAndroid);
          }
        }else{
          console.log("En revisión");
        }
      });

      timer(3000).subscribe(() => (this.showSplash = false));

      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#E36485");

      this._pushProvider.init_notification();

      if (this.platform.is("cordova")) {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if (canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy
              .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
              .then(
                () => console.log("Request successful"),
                (error) =>
                  console.log("Error requesting location permissions", error)
              );
          }
        });
      }

      this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
        })
        .catch((error) => {
          console.log("Error getting location", JSON.stringify(error));
        });
      if (this.idUser != null) {
        
        this.userProv.getUser(this.idUser).then((user) => {
          this.usuario = user;
          console.log("Este es el resultado del usuario: ", this.usuario);
          if (this.usuario == null) {
            this.rootPage = "LoginPage";
          } else {
            if (
              localStorage.getItem("isLogin") == "true" &&
              localStorage.getItem("datos") == "true" &&
              localStorage.getItem("notificando") != "true" &&
              localStorage.getItem("pago") != "true" &&
              localStorage.getItem("delivery") != "true" &&
              localStorage.getItem("califica") != "true"
            ) {
              this.rootPage = "HomePage";
              this.getBanners();
            }
            if (localStorage.getItem("datos") != "true") {
              console.log("item datos", localStorage.getItem("datos"));
              this.rootPage = "UserInformationPage";///carga de pagin
            }
            if (
              localStorage.getItem("isLogin") == "true" &&
              localStorage.getItem("califica") == "true"
            ) {
              this.nav.setRoot("ModalCalificaPage", {
                serviceID: localStorage.getItem("servicioID"),
              });
            }
            if (
              localStorage.getItem("isLogin") == "true" &&
              localStorage.getItem("notificando") == "true"
            ) {
              this.nav.setRoot("ModalDeliveryPage", {
                serviceID: localStorage.getItem("servicioID"),
              });
            }
            if (
              localStorage.getItem("isLogin") == "true" &&
              localStorage.getItem("delivery") == "true"
            ) {
              if (this.restaurante == "true") {
                this.nav.setRoot("DeliveryRestaurantPage", {
                  serviceID: localStorage.getItem("servicioID"),
                  pedidoID: localStorage.getItem("pedidoID"),
                });
              }

              if (this.restaurante != "true") {
                this.nav.setRoot("DeliveryTrackingPage", {
                  serviceID: localStorage.getItem("servicioID"),
                });
              }
            }
            if (
              localStorage.getItem("isLogin") == "true" &&
              localStorage.getItem("pago") == "true" &&
              localStorage.getItem("califica") != "true"
            ) {
              this.nav.setRoot("PaymentPage", {
                serviceID: localStorage.getItem("servicioID"),
              });
            }
            if (localStorage.getItem("isLogin") != "true") {
              this.rootPage = "FirstLandingPage";
            }
            if (
              localStorage.getItem("LoginPage") != "true" &&
              localStorage.getItem("anonimo") == "true"
            ) {
              this.rootPage = "FirstLandingPage";
              console.log(localStorage.getItem("anonimo"));
              localStorage.removeItem("banners");
            }

            if (this.platform.is("cordova")) {
              console.log(this.screenOrientation.type);
              this.screenOrientation.lock(
                this.screenOrientation.ORIENTATIONS.PORTRAIT
              );
            } else {
              console.log("¡¡¡ Solo funciona en dispositivos !!!");
            }
            this._ubicacionProv.iniciarGeolocalizacion();
          }
        });
      } else {
        this.rootPage = "FirstLandingPage";
      }
    });

    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      // Checks if can go back before show up the alert
      if (nav.canGoBack()) {
        nav.pop();
      } else {
        const alert = this.alertCtrl.create({
          title: "¿Quieres salir de Toc-Toc?",
          buttons: [
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                console.log("** Salida de Toc-Toc cancelada! **");
              },
            },
            {
              text: "Salir",
              handler: () => {
                this.platform.exitApp();
              },
            },
          ],
        });
        alert.present();
      }
    });
  }

  /**
   * --------------------------------------------------------------
   * Get Sidebar List
   * --------------------------------------------------------------
   */
  getSidebarList() {
    this.http.get("assets/i18n/en.json").subscribe(
      (data: any) => {
        this.pages = data.SIDEBAR_List;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getBanners() {
    this._providerSettings.getBanners().subscribe((banners) => {
      this.banners = banners;
      localStorage.setItem("banners", JSON.stringify(this.banners));
      console.log("Banners: ", this.banners);
    });
  }

  versionApp(idx: any) {
    this._providerSettings.getVersionApp(idx).subscribe((v: string) => {
      const AppInfo = v;
      this.AppV = AppInfo;
      this.appVersion.getVersionNumber().then(
        (res: string) => {
          console.log("VersionDB", this.AppV.versionApp);
          console.log("VersionNumber", res);
          if (res == this.AppV.versionApp) {
            console.log("Misma versión");
          } else {
            console.log("No coincide la versión");
            this.openAppVersion();
          }
        },
        (err) => {
          console.log('AppVersión', err);
        }
      );
    });
  }

  /*sendMail() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }
     });
     
     let email = {
       to: 'info@toctoc.com',
       subject: 'ToctocApp Soporte e Información',
       isHtml: true
     };
     
     // Send a text message using default options
     this.emailComposer.open(email);
  }*/

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }

  openAppVersion() {
    const modal = this.modalCtrl.create(ModalVersionAppPage);
    modal.present();
  }

  Salir() {
    this.authFire.auth.signOut().then(() => {
      localStorage.setItem("anonimo", "false");
      localStorage.removeItem("lng");
      localStorage.removeItem("lat");
      localStorage.removeItem("direEnd");
      localStorage.removeItem("playerID");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("uidSucursal");
      localStorage.removeItem("uid");
      localStorage.removeItem("datos");
      console.log(localStorage.getItem("datos"));
      this.nav.setRoot("FirstLandingPage");
    });
  }

  irTerminos() { //Tibe
    const modal = this.modalCtrl.create(TerminosPage);
    modal.present();
  }
  alertLogout() //Tibe
  {
    let alert = this.alertCtrl.create({
      title: '¿Salir de tu cuenta?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            console.log('Yes clicked')
            this.Salir();
          }
        }
      ]
    });
    alert.present();
  }
  alertContact() //Tibe
  {
    let alert = this.alertCtrl.create({
      title: 'Contacto',
      message: 'Telefono: <a href="tel:3320299290">3320299290</a> <br> Correo electrónico: <a href="mailto:hola@lolodelivery.com">hola@lolodelivery.com</a>',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Aceptar clcked');
          }
        }
      ]
    });
    alert.present();
  }
  alertInvitado()
  {
    let alert = this.alertCtrl.create({
      title: 'Registro necesario',
      message: 'Es necesario crear una cuenta para hacer uso de nuestra aplicación',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Aceptar clcked');
          }
        }
      ]
    });
    alert.present();
  }
}
