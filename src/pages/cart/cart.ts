/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 *
 * This file represents a component of Cart page
 * File path - '../../../../src/pages/cart/cart'
 */

import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  ModalController,
  ToastController,
  AlertController,
} from "ionic-angular";
import { RestaurantesProvider } from "../../providers/restaurantes/restaurantes";
import { Observable } from "rxjs/Observable";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-cart",
  templateUrl: "cart.html",
})
export class CartPage {
  productos: any[] = [];
  total: any = 0;
  total1: any = 0;
  totalProduc: any = 0;
  resultado: any;
  products: Observable<any[]>;
  articulosCarrito: any[] = [];
  estatus: any;
  servicioID: any;
  paramPagina: any;
  restauranteId: any;
  typeService: any;
  uidCategoria: any;
  // query de tarifa menu min
  tarifa_menu_mins: any;
  anonimo: any;

  THESUG: string;
  TRY: string;
  DELETE: string;
  NODELE: string;
  CANNOT: string;
  DELETEP: string;
  SURE: string;
  OK: string;
  CANCEL: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    public modalCtrl: ModalController,
    public restProvider: RestaurantesProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public afs: AngularFirestore,
    public authFire: AngularFireAuth,
    public trnaslateService: TranslateService
  ) {
    this.THESUG = trnaslateService.instant("CART.THESUG");
    this.TRY = trnaslateService.instant("CART.TRY");
    this.DELETE = trnaslateService.instant("CART.DELETE");
    this.NODELE = trnaslateService.instant("CART.NODELE");
    this.DELETEP = trnaslateService.instant("CART.DELETEP");
    this.CANNOT = trnaslateService.instant("CART.CANNOT");
    this.SURE = trnaslateService.instant("CART.SURE");
    this.OK = trnaslateService.instant('BOTTONS.OK');
    this.CANCEL = trnaslateService.instant('BOTTONS.CANCEL'); 

    this.menu.enable(false); // Enable sidemenu
    this.paramPagina = this.navParams.get("foodCategory");
    this.servicioID = localStorage.getItem("servicioID");
    this.estatus = this.navParams.get("estatus");
    this.typeService = localStorage.getItem("pedidoRes");
    console.log("Estatus recibido: ", this.estatus);
    this.restauranteId = this.navParams.get("restaurante");
    this.uidCategoria = this.navParams.get("uidCategoria");
    console.log("ID categoria Cart: ", this.uidCategoria);
    this.anonimo = localStorage.getItem("anonimo");
  }

  ionViewDidLoad() {
    //Código para eliminar el carrito si se queda sin productos
    let prueba = localStorage.getItem("carrito");
    // console.log("Este es el resultado: ",prueba);
    if (prueba != null) {
      // console.log("Este es la longitud del arreglo: ", prueba.length);
      if (prueba.length <= 2) {
        localStorage.removeItem("carrito");
      }
    }

    this.getData();
    let pedidoID = localStorage.getItem("pedidoID");
    // console.log("Este es el id del pedido: ",pedidoID);

    if (pedidoID != null) {
      this.restProvider.getAllProducts(pedidoID).then((e) => {
        this.products = e;
        // console.log("Estos son los products: ",this.products);
      });
    }
  }

  goToSummary(anonimo) {
    if (anonimo != "true") {
      //
      const uidSucursal = localStorage.getItem("uidSucursal");
      console.log("Este es un servico iOS: ", this.servicioID);
      //
      this.afs
        .collection("tarifas_menu_min", (ref) =>
          ref.where("uidSucursal", "==", uidSucursal)
        )
        .valueChanges()
        .subscribe((tarifas) => {
          this.tarifa_menu_mins = tarifas;
          //
          this.tarifa_menu_mins.forEach((tarifa) => {
            const costo = tarifa.costo;
            //
            if (this.total >= costo) {
              this.navCtrl.setRoot(
                "SummaryPage",
                {
                  servicioID: this.servicioID,
                  restaurante: this.restauranteId,
                  typeService: this.typeService,
                  foodCategory: this.paramPagina,
                  estatus: this.estatus,
                  uidCategoria: this.uidCategoria,
                },
                {
                  animation: "md-transition",
                  animate: true,
                  direction: "down",
                }
              );
            } else {
              this.alertCtrl
                .create({
                  title: this.THESUG + costo,
                  subTitle: this.TRY,
                  buttons: [this.OK],
                })
                .present();
            }
          });
        });
    } else {
      this.authFire.auth.signOut().then(() => {
        this.navCtrl.setRoot("FirstLandingPage");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("uid");
        localStorage.removeItem("anonimo");
        localStorage.removeItem("uidSucursal");
        localStorage.removeItem("pedidoID");
        localStorage.removeItem("carrito");
        localStorage.removeItem("pedidoRes");
        localStorage.removeItem("servicioID");
        localStorage.removeItem("restaurante");
        localStorage.removeItem("checked");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("lat");
        localStorage.removeItem("lng");
        localStorage.removeItem("banners");
        localStorage.removeItem("datos");
      });
    }
  }

  goBack() {
    this.navCtrl.setRoot(
      "FoodCategoryItemsPage",
      {
        restaurante: this.restauranteId,
        uidCategoria: this.uidCategoria,
      },
      {
        animation: "md-transition",
        animate: true,
        direction: "down",
      }
    );
  }

  getData() {
    this.productos = JSON.parse(localStorage.getItem("carrito"));
    if (this.productos != null) {
      for (let item of this.productos) {
        this.totalProduc = item.precio * item.cantidad;
        // console.log("EStos son los totales: ",this.totalProduc);
        // this.totalProductos= item.cantidad+this.totalProductos;

        this.total1 = this.totalProduc + this.total1;
        this.total = this.total1.toFixed(2);
      }
      this.resultado = 1;
    } else {
      this.resultado = 0;
    }
    // console.log("Resultado: ",this.resultado);

    // console.log("Este es el total: ",this.total);
  }

  borrar_producto(idc, slidingItem, idx) {
    this.articulosCarrito = JSON.parse(localStorage.getItem("carrito"));
    // console.log("Este es el total de productos", this.articulosCarrito.length);
    if (this.articulosCarrito.length >= 2) {
      this.restProvider
        .deleteProducto(idc)
        .then((exixte: any) => {
          let toast = this.toastCtrl.create({
            message: this.DELETEP,
            duration: 3000,
            position: "long",
          });

          // console.log(idx);
          this.productos.splice(idx, 1);
          // console.log(this.productos);
          localStorage.setItem("carrito", JSON.stringify(this.productos));

          slidingItem.close();
          this.navCtrl.setPages([
            {
              page: "CartPage",
              params: {
                uidCategoria: this.uidCategoria,
                restaurante: this.restauranteId,
              },
            },
          ]);

          toast.onDidDismiss(() => {
            console.log("Dismissed toast");
          });

          toast.present();
        })
        .catch((err) => {
          this.alertCtrl
            .create({
              title: this.NODELE,
              subTitle: this.TRY,
              buttons: [this.OK],
            })
            .present();
        });
    } else {
      this.alertCtrl
        .create({
          subTitle:this.CANNOT,
          buttons: [this.OK],
        })
        .present();
    }
  }

  cancelarCarrito() {
    const confirm = this.alertCtrl.create({
      message: this.SURE,
      buttons: [
        {
          text: this.CANCEL,
          handler: () => {
            console.log("Clic en Mantenerse");
          },
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
            // this.navCtrl.setPages([{page: 'FoodCategoriesPage'}]);
            this.navCtrl.setRoot("HomePage", [], {
              animation: "md-transition",
              animate: true,
              direction: "down",
            });
            // this.rootPage = "CartPage";
          },
        },
      ],
    });
    confirm.present();
  }

  productEditModal(idx, producto) {
    this.navCtrl.setRoot(
      "ModificarCarritoPage",
      {
        idx: idx,
        producto: producto,
        uidCategoria: this.uidCategoria,
        restauranteId: this.restauranteId,
      },
      {
        animation: "md-transition",
        animate: true,
        direction: "down",
      }
    );
  }
}
