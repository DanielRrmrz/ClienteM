import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  ToastController,
  LoadingController,
  AlertController
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
// import * as firebase from "firebase/app";
import "firebase/firestore";
import { Observable } from "rxjs/Observable";
import { AngularFirestore } from "@angular/fire/firestore";


import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { RegisterUserProvider } from "../../providers/register-user/register-user";
import { UbicacionProvider } from "../../providers/ubicacion/ubicacion";
import { PushProvider } from "../../providers/push/push";
import { Platform, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { TerminosPage } from '../terminos/terminos';
import { PrivacidadPage } from '../privacidad/privacidad';


@IonicPage()
@Component({
  selector: "page-user-information",
  templateUrl: "user-information.html"
})
export class UserInformationPage {
  // db = firebase.firestore();
  myForm: FormGroup;
  UserInfoForm: any = {};
  uid: any;
  email:any;
  usermail:any;
  us: any;
  sucursales: Observable<any[]>;
  user: any = {};
  phone: any;
  username_: any;
  lastname_: any
  phone_: any;
  email_: any;
  terminos: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public loadinCtl: LoadingController,
    public alertCtrl: AlertController,
    public userProvider: RegisterUserProvider,
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public db: AngularFirestore,
    public _ubicacionProv: UbicacionProvider,
    public _pushProvider: PushProvider,
    public platform: Platform,
    public storage: Storage,
    public translateService: TranslateService,
    public modalCtrl: ModalController
   
  ) {
    if (this.platform.is("")) {
      this.storage.ready().then(() => {
        this.storage.get("isLogin").then(valor => {
          this.uid = valor;
          console.log("Maldito local", this.uid);
        });
      });
    }else{
      this.uid = localStorage.getItem("uid");
      this.email = localStorage.getItem("email");
    }
    
    console.log("Este es el ID" + this.uid);
    this._ubicacionProv.iniciarGeolocalizacion();
    this.menu.enable(false); // Disable sidemenu
    this.phone = navParams.get('tipo');

    this.username_ = translateService.instant('USER_INFORMATION.USERNAME');
    this.lastname_ = translateService.instant('USER_INFORMATION.LASTNAME');
    this.phone_ = translateService.instant('USER_INFORMATION.PHONE');
    this.email_ = translateService.instant('USER_INFORMATION.EMAIL');


  }

  /**
   * Do any initialization
   */
  ngOnInit() {
    this.formValidation();
    this.loadUser();
    // this.loadSucursales();
  }

 

  loadUser() {
    this.userProvider.getUser(this.uid).then(user => {
      this.us = user;
      this.UserInfoForm = this.us;
      console.log("Esta es la informacion del usuario", this.UserInfoForm);
    });
  }

  // loadSucursales() {
  //   this.userProvider.getAllDocuments("sucursales").then(e => {
  //     this.sucursales = e;
  //     console.log("Estas son las sucursales: ", this.sucursales);
  //   });
  // }

  /***
   * --------------------------------------------------------------
   * Form Validation
   * --------------------------------------------------------------
   * @method   formValidation
   */
  formValidation() {

    if (this.phone != 'phone') {
      this.myForm = this.formBuilder.group({
        username: ["", Validators.compose([Validators.required])],
        lastname: ["", Validators.compose([Validators.required])],
        phone: ["", Validators.compose([Validators.required])],
        email: [
          "",
          Validators.compose([Validators.required, Validators.email])
        ],
        terminos: ["", Validators.compose([Validators.required])]
        // location: ["", Validators.compose([Validators.required])]
      });  
    }else{
       this.myForm = this.formBuilder.group({
         username: ["", Validators.compose([Validators.required])],
         lastname: ["", Validators.compose([Validators.required])],
         phone: ["", Validators.compose([Validators.required])],
         email: [""],
         terminos: ["", Validators.compose([Validators.required])]
        //  location: ["", Validators.compose([Validators.required])]
       });  
    }
    
  }

  /**
   * --------------------------------------------------------------
   * Go To Menu Category Page
   * --------------------------------------------------------------
   */
  gotoMenuCategoryPage() {
    this.navCtrl.setRoot("FoodCategoriesPage");
  }
  cerrarModal() {
    this.navCtrl.setRoot("LoginRegistroPage");
  }

  registrarUsuario() {
    let perfil = {
      username: this.UserInfoForm.username,
      lastname: this.UserInfoForm.lastname,
      phone: this.UserInfoForm.phone,
      email: this.email,
      terminos: this.terminos,
      location: "gwjKHOTLwLm2PZwUzY0o"
    };
    let content = this.translateService.instant('USER_INFORMATION.UPDATEINFO');
    let loading = this.loadinCtl.create({
      spinner: "bubbles",
      content: content
    });

    this.userProvider
      .register(perfil, this.uid)
      .then((res: any) => {
        if (this.platform.is("")) {
          this.storage.set("isLogin", "true");
        }else{
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("datos", "true");
        }
        

        setTimeout(() => {
          localStorage.setItem("datos", "true");//Tibe
          this.navCtrl.setRoot("HomePage");
        }, 2000);

        setTimeout(() => {
          loading.dismiss();
        }, 1000);
      })
      .catch(err => {
        let title = this.translateService.instant('USER_INFORMATION.TITLE_');
        let subTitle = this.translateService.instant('USER_INFORMATION.SUBTITLE_');
        let buttons = this.translateService.instant('USER_INFORMATION.OK');
        this.alertCtrl
          .create({
            title: title,
            subTitle: subTitle,
            buttons: [buttons]
          })
          .present();
      });

    loading.present();
  }
  registrarUsuario1() {
    let perfil = {
      username: this.UserInfoForm.username,
      lastname: this.UserInfoForm.lastname,
      phone: this.UserInfoForm.phone,
      email: this.email,
      terminos: this.terminos,
      location: "gwjKHOTLwLm2PZwUzY0o"
    };

    console.log("Estos son los datos para registrar al usuario: ", perfil);

    
  }

  irTerminos() {
    const modal = this.modalCtrl.create(TerminosPage);
    modal.present();
  }

  irPrivasidad() {
    const modal = this.modalCtrl.create(PrivacidadPage);
    modal.present();
  }

}
