import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RegisterUserProvider } from "../../providers/register-user/register-user";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-perfil",
  templateUrl: "perfil.html",
})
export class PerfilPage {
  user: any = {};
  _formPerfil: FormGroup;
  formDisabled: boolean = true;
  username_: any;
  lastname_: any
  phone_: any;
  // email_: any;
  updateProfile_: any;
  errorProfile_: any;
  ok_: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _userProvider: RegisterUserProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public translateService: TranslateService
  ) {
    this.username_ = translateService.instant('USER_INFORMATION.USERNAME');
    this.lastname_ = translateService.instant('USER_INFORMATION.LASTNAME');
    this.phone_ = translateService.instant('USER_INFORMATION.PHONE');
    // this.email_ = translateService.instant('USER_INFORMATION.EMAIL');
    this.updateProfile_ = translateService.instant('PROFILE.UPDATEPROFILE');
    this.errorProfile_ = translateService.instant('PROFILE.ERRORPROFILE');
    this.ok_ = translateService.instant('BOTTONS.OK');


    this._formPerfil = this.formPerfil();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PerfilPage");
    this.getUser();
  }

  getUser() {
    const idUser = localStorage.getItem("uid");
    this._userProvider.getUser(idUser).then((us: any) => {
      console.log("usuario: ", us);
      this.user = us;
    });
  }

  disbled() {
    if (this.formDisabled == true) {
      this.formDisabled = false;
    } else {
      this.formDisabled = true;
      this.getUser();
    }
  }

  formPerfil() {
    return this.formBuilder.group({
      username: ['', Validators.required],
      lastname: ['', Validators.required],
      // email: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  updatePerfil() {
    console.log(this._formPerfil.value);
    const uid = localStorage.getItem('uid');
    const datosPerfil = this._formPerfil.value;
    this._userProvider.updateUserPerfil(uid, datosPerfil).then((res: any) => {
      const success = res.success;
      if (success == true) {
        let alert = this.alertCtrl.create({
          subTitle: this.updateProfile_,
          buttons: [this.ok_]
        });
        alert.present();
        this.formDisabled = true;
      } else {
        let alert = this.alertCtrl.create({
          subTitle: this.errorProfile_,
          buttons: [this.ok_]
        });
        alert.present();
      }
    });
  }
}
