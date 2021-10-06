import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Market } from '@ionic-native/market';

@IonicPage()
@Component({
  selector: 'page-modal-version-app',
  templateUrl: 'modal-version-app.html',
})
export class ModalVersionAppPage {

  plt: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public market: Market) {
    if (this.platform.is('android')) {
      this.plt = 'android';
    }

    if (this.platform.is('ios')) {
      this.plt = 'ios';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalVersionAppPage');
  }

  android(){
    this.market.open('air.com.appbringme.BMEAppCliente');
  }

  ios(){
    this.market.open('1213840257');
  }

}
