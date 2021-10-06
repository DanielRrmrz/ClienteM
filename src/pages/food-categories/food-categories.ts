/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Food Categories page
 * File path - '../../../../src/pages/food-categories/food-categories'
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { RestaurantesProvider } from '../../providers/restaurantes/restaurantes';
import { Observable } from "rxjs/Observable";
import { SettingsProvider } from '../../providers/settings/settings';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-food-categories",
  templateUrl: "food-categories.html"
})
export class FoodCategoriesPage {

  restaurantes: Observable<any[]>;
  uidCategoria: any;
  categoria: any = {};
  timeCierre: any = {};
  SERVICECON: string;
  OK: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public restProvider: RestaurantesProvider,
    public alertCtrl: AlertController,
    public translateService :TranslateService,
    public _settingsProvider: SettingsProvider
  ) {
    this.SERVICECON = translateService.instant('FOOD_CATEGORIES.SERVICECON');
    this.OK = translateService.instant('BOTTONS.OK');
  }

  gotoCategoryItemList(category, key, horaCierre) {
    console.log("REstaurante: ", category);
    this.timeCierre = horaCierre;
    let currenTime = moment().format('HH:mm:ss');
    console.log("Hora de cierre: ", this.timeCierre);
    console.log("Current time: ", currenTime);
    

    if (currenTime>=this.timeCierre) {
      this.errorCerrado();
      
    }else{
      this.navCtrl.setRoot(
        "FoodCategoryItemsPage",
        {
          restaurante: category,
          uidCategoria: key
        },
        {
          
          animation: "md-transition",
          animate: true,
          direction: "down"
        }
      );      
    }          
  }

  errorCerrado() {
    const confirm = this.alertCtrl.create({
      message: this.SERVICECON,
      buttons: [
        {
          text: this.OK,
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }


  /**
  * Do any initialization
  */
  ngOnInit() {
    this.uidCategoria = this.navParams.get("uidCategoria");
    console.log(this.uidCategoria);
    this.loadCategoria();
    this.loadRestaurantes();  
    // this.getFecha();
  }

  // gotoCartPage() {
  //   const modal = this.modalCtrl.create("CartPage");
  //   modal.present();
  // }

  // getFecha(){
  //   let data = moment().format('YYYYMMDD');
  //   let time = moment().format('HH:mm:ss');
  //   this.time2 = moment("17:00:00");
  //   console.log("Esta es la fecha2: ", this.time2._i);
    
  //   console.log('Esta esa la fecha1: ', data + ' and time: ', time);

  //   if (time>=this.time2._i) {
  //     console.log("ya esta cerrado");
  //   }else{
  //     console.log("Esta habierto");
      
  //   }
  // }

  goBack() {
     this.navCtrl.setRoot("ComerciosPage", [], {
       
       animation: "md-transition",
       animate: true,
       direction: "down"
     });
  }
  
  loadCategoria(){
    this._settingsProvider.getOneCategoria(this.uidCategoria).subscribe(catego => {
      console.log('Categoria: ', catego);
      const _categoria = catego;
      this.categoria = _categoria;
      console.log(this.categoria.nombre);
      
    });
  }

  loadRestaurantes() {
     const uidSucursal = localStorage.getItem("uidSucursal");
    this.restProvider
      .getAllRestaurantes("users", uidSucursal, this.uidCategoria)
      .then(e => {
        this.restaurantes = e;
      });
  }

  
}
