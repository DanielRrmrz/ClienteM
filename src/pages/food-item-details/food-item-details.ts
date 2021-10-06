/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 *
 * This file represents a component of Food Item Details page
 * File path - '../../../../src/pages/food-item-details/food-item-details'
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
// import { FoodCategoryItemsPage } from "../food-category-items/food-category-items";
// import { SettingsProvider } from '../../providers/settings/settings';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-food-item-details",
  templateUrl: "food-item-details.html"
})
export class FoodItemDetailsPage {
  currentNumber = 0;
  producto: any;
  restauranteId: any;
  banners: any;
  detalles: any = {};
  items: any[] = [];
  total: any;
  uidCategoria: any;
  nota: any = "";
  
  NOTE: string;
  ADDPRODUCT: string;
  ALREADY: string;
  TRYP: string;
  REMEMBER: string;
  GOTO: string;
  NEW: string;
  ADDP: string;
  CART: string;
  OK: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private viewCtrl: ViewController,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public restProvider: RestaurantesProvider,
    public translateService: TranslateService
  ) {
    this.NOTE = translateService.instant('FOOD_ITEMS_DETAILS.NOTE')
    this.ADDPRODUCT = translateService.instant('FOOD_ITEMS_DETAILS.ADDPRODUCT');
    this.ALREADY = translateService.instant('FOOD_ITEMS_DETAILS.ALREADY');
    this.TRYP = translateService.instant('FOOD_ITEMS_DETAILS.TRYP');
    this.REMEMBER = translateService.instant('FOOD_ITEMS_DETAILS.REMEMBER');
    this.GOTO = translateService.instant('FOOD_ITEMS_DETAILS.GOTO');
    this.NEW = translateService.instant('FOOD_ITEMS_DETAILS.NEW');
    this.ADDP = translateService.instant('FOOD_ITEMS_DETAILS.ADDP');
    this.CART = translateService.instant('FOOD_ITEMS_DETAILS.CART');
    this.OK = translateService.instant('BOTTONS.OK');
  }

  ionViewDidLoad() {
    this.uidCategoria = this.navParams.get("uidCategoria");
    console.log(this.uidCategoria);
    this.getNavParamsData();
    this.getDetalles();
    this.totalProductos();
    // this.getProducto();
  }

  async getNavParamsData() {
    if (this.navParams.get("producto")) {
      this.producto = this.navParams.get("producto");

      // console.log("Producto a consultar: ",this.producto);
    }

    this.restauranteId = this.navParams.get("restaurante");
  }

  getDetalles() {
    this.restProvider.getDetallesProducto(this.producto).then(e => {
      this.detalles = e;
      // console.log('Detalles del producto: ',this.detalles);
    });
  }
  increment() {
    this.currentNumber++;
  }

  decrement() {
    if (this.currentNumber > 0) {
      this.currentNumber--;
    }
  }

  // dismiss() {
  //   this.viewCtrl.dismiss();
  // }

  gotoCartPage() {
    this.navCtrl.setRoot(
      "CartPage",
      {
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
   * goBack function
   * This function dismiss the popup modal
   */

  goBack() {
    this.navCtrl.setRoot(
      "FoodCategoryItemsPage",
      {
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

  agregar_producto(codigo, cantidad, photo, nombre, precio) {
    console.log(
      "Datos del producto a guardar: ",
      cantidad,
      photo,
      nombre,
      precio,
      this.nota
    );
    let loading = this.loadCtrl.create({
      spinner: "bubbles",
      content: this.ADDPRODUCT
    });
    loading.present();
    let carrito = {
      codigo: codigo,
      cantidad: cantidad,
      photo: photo,
      nombre: nombre,
      precio: precio,
      total: precio * cantidad,
      nota: this.nota
    };

    let producto = {
      cantidad: cantidad,
      descripcion: nombre,
      productoID: codigo,
      nota: this.nota,
      total: precio * cantidad
    };

    // let verdadero = 'true';

    let restaurante = localStorage.getItem("restaurante");
    if (restaurante == null || restaurante == this.restauranteId) {
      let carro = JSON.parse(localStorage.getItem("carrito"));
      if (carro != null) {
        this.items = JSON.parse(localStorage.getItem("carrito"));
        for (let item of this.items) {
          if (codigo == item.codigo) {
            this.alertCtrl
              .create({
                subTitle: nombre + ", " + this.ALREADY,
                buttons: [this.OK]
              })
              .present();
              loading.dismiss();
            return;
          }
        }
      }
      this.items.push(carrito);
      localStorage.setItem("carrito", JSON.stringify(this.items));
      localStorage.setItem("restaurante", this.restauranteId);

      // this.alertCtrl.create({
      //   title: "Producto Agregado",
      //   subTitle: nombre + ", se ha agregado correctamente en su carrito de compras",
      //   buttons: ["OK"]
      // }).present();

      let pedidoID = localStorage.getItem("pedidoID");
      let servicioID = localStorage.getItem("servicioID");
      this.restProvider.saveServiceProductRES(producto, pedidoID, servicioID).then((res: any) => {
        if (res.success == true) {
          setTimeout(() => {
            this.navCtrl.setPages([
              {
                page: "FoodCategoryItemsPage",
                params: {
                  restaurante: this.restauranteId,
                  uidCategoria: this.uidCategoria
                }
              }
            ]);
            loading.dismiss();
          }, 1000);
          
        } else {
          setTimeout(() => {
            this.alertCtrl
            .create({
              subTitle: this.TRYP,
              buttons: [this.OK]
            })
            .present();
            loading.dismiss();
          return;
          }, 1000);
          
        }
      });

      
    } else if (restaurante != null && restaurante != this.restauranteId) {
      const confirm = this.alertCtrl.create({
        message: this.REMEMBER,
        buttons: [
          {
            text: this.GOTO,
            handler: () => {
              this.navCtrl.setRoot(
                "CartPage",
                {
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
          },
          {
            text: this.NEW,
            handler: () => {
              localStorage.removeItem("carrito");
              localStorage.removeItem("restaurante");
              this.items.push(carrito);

              localStorage.setItem("carrito", JSON.stringify(this.items));

              localStorage.setItem("restaurante", this.restauranteId);

              this.alertCtrl
                .create({
                  subTitle:
                    nombre +
                    ", " + this.CART,
                  buttons: [this.OK]
                })
                .present();
              this.navCtrl.setRoot(
                "FoodCategoryItemsPage",
                {
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
          }
        ]
      });
      confirm.present();
    }
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
}
