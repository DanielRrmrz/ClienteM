import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { RestaurantesProvider } from '../../providers/restaurantes/restaurantes';
import { Observable } from "rxjs/Observable";
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: "page-modificar-carrito",
  templateUrl: "modificar-carrito.html"
})
export class ModificarCarritoPage {
  currentNumber = 0;
  producto: any;
  idx: any;
  detalles: any = {};
  items: any[] = [];
  total: any;
  productos: Observable<any[]>;
  uidCategoria: any;
  restauranteId: any;
  UPDATEPRO: string;
  TRY: string;
  TITLE_: string;
  ok: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public restProvider: RestaurantesProvider,
    public toastCtrl: ToastController,
    public trnaslateService: TranslateService
  ) {
    this.UPDATEPRO = trnaslateService.instant('MODPRODUCT.UPDATEPRO');
    this.TRY = trnaslateService.instant('MODPRODUCT.TRY');
    this.TITLE_ = trnaslateService.instant('MODPRODUCT.TITLE_');
    this.ok = trnaslateService.instant('BOTTONS.OK');
  }

  ionViewDidLoad() {
    this.getNavParamsData();
    this.getDetalles();
    this.cargarProducto(this.idx);
    this.totalProductos();
    // this.getProducto();

    this.uidCategoria = this.navParams.get("uidCategoria");
    console.log("ID categoria: ", this.uidCategoria);
    this.restauranteId = this.navParams.get("restauranteId");

    let pedidoID = localStorage.getItem("pedidoID");
    if (pedidoID != null) {
      this.restProvider.getAllProducts(pedidoID).then(e => {
        this.productos = e;
      });
    }
  }

  async getNavParamsData() {
    if (this.navParams.get("producto")) {
      this.producto = this.navParams.get("producto");
      // console.log("Producto a consultar: ",this.producto);
    }
    this.idx = this.navParams.get("idx");
  }

  cargarProducto(idx) {
    this.items = JSON.parse(localStorage.getItem("carrito"));
    // console.log('index', idx);
    // console.log('productos', this.items[idx].cantidad);

    this.currentNumber = this.items[idx].cantidad;
    // this.nota = this.items[idx].nota;
  }

  getDetalles() {
    this.restProvider.getDetallesProducto(this.producto).then(e => {
      this.detalles = e;
      // console.log('Detalles del producto: ',this.detalles);
      console.log("Este es el nombre: ", this.detalles.nombre);
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
      { uidCategoria: this.uidCategoria },
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
      "CartPage",
      {
        uidCategoria: this.uidCategoria,
        restaurante: this.restauranteId
      },
      {
        
        animation: "md-transition",
        animate: true,
        direction: "down"
      }
    );
  }

  modificar_producto(idc, codigo, cantidad, photo, nombre, precio, idx) {
    this.restProvider
      .updateProducto(cantidad, idc)
      .then((exixte: any) => {
        let toast = this.toastCtrl.create({
          message: this.UPDATEPRO,
          duration: 3000,
          position: "long"
        });

        this.items = JSON.parse(localStorage.getItem("carrito"));

        this.items[idx] = {
          codigo: codigo,
          cantidad: cantidad,
          photo: photo,
          nombre: nombre,
          precio: precio,
          total: precio * cantidad
        };

        localStorage.setItem("carrito", JSON.stringify(this.items));

        this.navCtrl.setRoot(
          "CartPage",
          {
            uidCategoria: this.uidCategoria,
            restaurante: this.restauranteId
          },
          {
            
            animation: "md-transition",
            animate: true,
            direction: "down"
          }
        );

        toast.onDidDismiss(() => {
          console.log("Dismissed toast");
        });

        toast.present();
      })
      .catch(err => {
        this.alertCtrl
          .create({
            title: this.TITLE_,
            subTitle: this.TRY,
            buttons: [this.ok]
          })
          .present();
      });

    // this.navCtrl.setPages([{ page: 'CartPage'}]);
  }

  // modificar_producto(cantidad, nota, idx) {
  //   let toast = this.toastCtrl.create({
  //     message: "Producto actualizado",
  //     duration: 3000,
  //     position: "long"
  //   });

  //   this.providerServ
  //     .updateProducto(cantidad, nota, idx)
  //     .then((exixte: any) => {
  //       this.navCtrl.setPages([
  //         { page: "PlacePage", params: { page: "list" } }
  //       ]);
  //     })
  //     .catch(err => {
  //       this.alertCtrl
  //         .create({
  //           title: "Producto no actualizado",
  //           subTitle: "Inteta de nuevo",
  //           buttons: ["Aceptar"]
  //         })
  //         .present();
  //     });

  //   toast.onDidDismiss(() => {
  //     console.log("Dismissed toast");
  //   });

  //   toast.present();
  // }

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
