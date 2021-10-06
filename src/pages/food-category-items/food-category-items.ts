/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 *
 * This file represents a component of Food Category Item page
 * File path - '../../../../src/pages/food-category-items/food-category-items'
 */

import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  LoadingController
} from "ionic-angular";
import { RestaurantesProvider } from "../../providers/restaurantes/restaurantes";
// import { Observable } from "rxjs/Observable";
import { SettingsProvider } from '../../providers/settings/settings';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-food-category-items",
  templateUrl: "food-category-items.html"
})
export class FoodCategoryItemsPage {
  restauranteId: any;
  foodItems: any;
  restaurante: any = {};
  itemsFood: any[];
  total: any;
  pedido: any = {};
  latitud: any;
  longitud: any;
  uidCategoria: any;
  comida: any[];
  categoria: any = {};
  LOADING: string;
  REMEMBER: string;
  CANCEL: string;
  OK: string;
  SEARCH: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public restProvider: RestaurantesProvider,
    public translateService: TranslateService,
    public _settingsProvider: SettingsProvider
  ) {
    this.LOADING = translateService.instant('FOOD_CATEGORIES_ITEMS.LOADING')
    this.REMEMBER = translateService.instant('FOOD_CATEGORIES_ITEMS.REMEMBER');
    this.CANCEL = translateService.instant('BOTTONS.CANCEL'); 
    this.OK = translateService.instant('BOTTONS.OK');
    this.SEARCH = translateService.instant('FOOD_CATEGORIES_ITEMS.SEARCH');
    if (this.navParams.get("restaurante")) {
      this.restauranteId = this.navParams.get("restaurante");
      console.log("Id del restaurante: ",this.restauranteId);
    }
  }

  /***
   * --------------------------------------------------------------
   * Lifecycle Event - ionViewDidLoad()
   * --------------------------------------------------------------
   *
   * Fired when the page has loaded
   */
  ionViewDidLoad() {
    this.uidCategoria = this.navParams.get("uidCategoria");
    console.log("Categoria Id FCItems: ", this.uidCategoria);
    this.getFoodItems();
    this.getRestaurante();
    this.totalProductos();
    this.loadCategoria();
    let servicio = localStorage.getItem("servicioID");

    if (servicio == null) {
      this.restProvider.saveServiceRES(this.restauranteId).then((res: any) => {
        console.log(res);
        let loading = this.loadingCtrl.create({
          spinner: "bubbles",
          content: this.LOADING
        });
        loading.present();
        if (res.success == true) {
          setTimeout(() => {
            loading.dismiss();
          }, 1000);
        }else{
          this.goBackTwo();
        }
      });
    }

    // this.savePedido();
  }

  /**
   * --------------------------------------------------------------
   * Get All Food Items
   * --------------------------------------------------------------
   */

  loadCategoria() {
    this._settingsProvider
      .getOneCategoria(this.uidCategoria)
      .subscribe(catego => {
        console.log("Categoria: ", catego);
        const _categoria = catego;
        this.categoria = _categoria;
        console.log(this.categoria.nombre);
      });
  }

  getFoodItems() {
    this.restProvider.getAllMenu(this.restauranteId).subscribe(e => {
      this.itemsFood = e;
      this.comida = e;
      // console.log('Resultado: ',this.itemsFood);
      // console.log("Si esta llegando");
    });
  }

  // Esto es para el buscador
  initializeItems(): void {
    this.itemsFood = this.comida;
  }
  getItems(evt) {
    this.initializeItems();
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.itemsFood = this.itemsFood.filter(item => {
      if (item.nombre && searchTerm) {
        if (item.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }
  //Termina. Esto es para el buscador

  getRestaurante() {
    this.restProvider.getRestaurante(this.restauranteId).then(e => {
      this.restaurante = e;
      console.log("Restaurante: ", this.restaurante);
      this.latitud = this.restaurante.direccion._lat;
      this.longitud = this.restaurante.direccion._long;
    });
  }

  // Remove quantity
  minusQuantity(item, index) {
    if (this.foodItems[index].quantity > 0) {
      this.foodItems[index].quantity = this.foodItems[index].quantity - 1;
    }
  }

  // Add quantity
  addQuantity(item, index) {
    if (this.foodItems[index].quantity) {
      this.foodItems[index].quantity = this.foodItems[index].quantity + 1;
    } else {
      this.foodItems[index].quantity = 0;
      this.foodItems[index].quantity = this.foodItems[index].quantity + 1;
    }
  }

  /**
   * --------------------------------------------------------------
   * GoTO Item Details Page
   * --------------------------------------------------------------
   */
  gotoItemDetails(producto) {
    this.navCtrl.setRoot(
      "FoodItemDetailsPage",
      {
        producto: producto,
        restaurante: this.restauranteId,
        uidCategoria: this.uidCategoria
      },
      {
        
        animation: "md-transition",
        animate: true,
        direction: "down"
      }
    );
  }
  /**
   * Dismiss function
   * This function dismiss the popup modal
   */
  // dismiss() {
  //   this.viewCtrl.dismiss();
  // }

  gotoCartPage(foodCategory) {
    this.navCtrl.setRoot(
      "CartPage",
      {
        foodCategory: foodCategory,
        restaurante: this.restauranteId,
        uidCategoria: this.uidCategoria
      },
      {
        
        animation: "md-transition",
        animate: true,
        direction: "down"
      }
    );
  }

  goBack() {
    let consultar = JSON.parse(localStorage.getItem("carrito"));
    if (consultar != null) {
      this.showConfirm();
    } else {
      let servicio = localStorage.getItem("servicioID");
      this.restProvider
        .deleteServicio(servicio)
        .then((exixte: any) => {
          localStorage.removeItem("servicioID");
          this.navCtrl.setRoot(
            "FoodCategoriesPage",
            { uidCategoria: this.uidCategoria },
            {
              
              animation: "md-transition",
              animate: true,
              direction: "down"
            }
          );
        })
        .catch(err => {});
    }
  }

  goBackTwo(){
    this.navCtrl.setRoot(
      "FoodCategoriesPage",
      { uidCategoria: this.uidCategoria },
      {
        
        animation: "md-transition",
        animate: true,
        direction: "down"
      }
    );
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      message: this.REMEMBER,
      buttons: [
        {
          text: this.CANCEL,
          handler: () => {
            console.log("Clic en Mantenerse");
          }
        },
        {
          text: this.OK,
          handler: () => {
            let servicioID = localStorage.getItem("servicioID");
            let pedidoID = localStorage.getItem("pedidoID");
            this.restProvider.deleteAllProducts(servicioID, pedidoID);
            localStorage.removeItem("carrito");
            localStorage.removeItem("restaurante");
            localStorage.removeItem("pedidoRes");
            localStorage.removeItem("servicioID");
            localStorage.removeItem("pedidoID");
            this.navCtrl.setRoot(
              "FoodCategoriesPage",
              { uidCategoria: this.uidCategoria },
              {
                
                animation: "md-transition",
                animate: true,
                direction: "down"
              }
            );
          }
        }
      ]
    });
    confirm.present();
  }

  totalProductos() {
    let productos = JSON.parse(localStorage.getItem("carrito"));
    if (productos != null) {
      var contador = 0;
      for (let item of productos) {
        contador = contador + item.cantidad;
      }
      this.total = contador;
      // console.log("Este es el total fuera del foreach: ",this.total);
    }
  }

  //Guardar el pedido
  savePedido(latitud, longitud, direccion, nombre) {
    this.pedido = {
      latPedido: latitud,
      lngPedido: longitud,
      placeName: nombre,
      placeDire: direccion
    };
    // console.log("Esta es la informacion del pedido: ",this.pedido);

    let pedido = localStorage.getItem("pedidoRes");
    if (pedido != "true") {
      const servicioID = localStorage.getItem("servicioID");
      this.restProvider.savePedidoRES(servicioID, this.pedido);
    }
    localStorage.setItem("pedidoRes", "true");
  }
}
