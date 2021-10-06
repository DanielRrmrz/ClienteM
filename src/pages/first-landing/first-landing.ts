/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 *
 * This file represents a component of First Landing page
 * File path - '../../../../src/pages/first-landing/first-landing'
 */

import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  AlertController,
  LoadingController,
  ModalController,
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import { TranslateService } from "@ngx-translate/core";
import { ToastController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@IonicPage()
@Component({
  selector: "page-first-landing",
  templateUrl: "first-landing.html",
})
export class FirstLandingPage {
  languages: any;
  language: any;
  bandera: string = "assets/imgs/es.png";
  developer = {};
  developers = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    public alertCtrl: AlertController,
    public loadinCtrl: LoadingController,
    public toastCtrl: ToastController,
    public fbAuth: AngularFireAuth,
    public modalCtrl: ModalController,
    public translateService: TranslateService,
    public emailComposer: EmailComposer,
    public iab :InAppBrowser
  ) {
    this.menu.enable(false); // Disable sidemenu
    const lang = localStorage.getItem("idioma");
    if (lang == "es") {
      this.bandera = "assets/imgs/es.png";
    } else if (lang == "en") {
      this.bandera = "assets/imgs/en.png"
    }
  }

  gotoSecondLandingPage() {
    this.navCtrl.setRoot("SecondLandingPage");
  }
  gotoEmailLogin() {
    this.navCtrl.setRoot("LoginEmailPage");
    localStorage.setItem("anonimo", "false");
    console.log("Datos: ", localStorage.getItem("datos"));
  }
  gotoEmailRegistro() {
    this.navCtrl.setRoot("LoginRegistroPage");//Tibe
  }
  Guest() {
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("uid", "yFuQFayvIYRZWP7ILKGTW8EAbLI2");
    localStorage.setItem("anonimo", "true");
    localStorage.setItem("uidSucursal", "6tjoroOWYYIH2IEWZN7g");
    localStorage.setItem("lat", "22.1126598");
    localStorage.setItem("lng", "-101.0961555");
    this.navCtrl.setRoot("HomePage");
  }
  
  idioma() {
    this.translateService.get("LANGUAGES").subscribe((text: any) => {
      let title = this.translateService.instant('FIRST_LANDING_PAGE.LANGUAGE');
      let cancel = this.translateService.instant('FIRST_LANDING_PAGE.CANCEL');
      let ok = this.translateService.instant('FIRST_LANDING_PAGE.OK');
      let alert = this.alertCtrl.create();
      
      alert.setTitle(title);

      text.forEach((l: any) => {
        console.log(l);
        alert.addInput({
          type: "radio",
          label: l.VALUE,
          value: l.ID,
          checked: false,
        });
      });

      alert.addButton(cancel);
      alert.addButton({
        text: ok,
        handler: (data) => {
          console.log(data);
          localStorage.setItem('idioma', data);
          if (data == "es") {
            this.bandera = "assets/imgs/es.png";
            this.translateService.setDefaultLang(data);
          } else if(data == "en") {
            this.bandera = "assets/imgs/en.png";
            this.translateService.setDefaultLang(data);
          }else if(data == undefined){
            this.errorData();
          }
        },
      });
      alert.present();
    });
  }

  errorData() {
    let toast = this.toastCtrl.create({
      message: 'Ningún idioma seleccionado.',
      duration: 3000,
      position: 'top',
      cssClass: "normalToast"
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  /*sendMail() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }
     });
     
     let email = {
       to: 'info@lolo.com',
       subject: 'Lolo-TocToc Soporte e Información',
       isHtml: true
     };
     
     // Send a text message using default options
     this.emailComposer.open(email);
  }*/

  registraConvenio() {
    const url = 'https://toctoczapopan.mx'
    const browser = this.iab.create(url, '_blank');
    browser.on('closePressed').subscribe(res => {
      browser.close();
    });
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

}
