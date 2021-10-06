import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController,
  AlertController
} from "ionic-angular";

import { ServicesProvider } from "../../providers/services/services";
import { ModalProductPage } from "../modal-product/modal-product";

@IonicPage()
@Component({
  selector: "page-products",
  templateUrl: "products.html"
})
export class ProductsPage {
  idPedido: any;
  getProductos: any;
  servicioID: any;
  pedidoData: any = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public providerServ: ServicesProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {
    this.idPedido = this.navParams.get("pedido");
    console.log("idPedido: ", this.idPedido);
    this.servicioID = localStorage.getItem("servicioID");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductsPage");
  }

  ngOnInit() {
    this.loadPedido(this.idPedido);
    this.cargarProductos();
  }

  goBack() {
    this.navCtrl.setPages([
      { page: "ServicePage", params: { pedido: this.idPedido } }
    ]);
  }

  loadPedido(idx) {
    this.providerServ.getOnePedido(idx).subscribe(pedido => {
      this.pedidoData = pedido;
    });
  }

  cargarProductos() {
    this.providerServ
      .getAllProductos("productos", this.idPedido)
      .subscribe(e => {
        this.getProductos = e;
        console.log("Productos: ", this.getProductos);
      });
  }

  deleteProducto(slidingItem, idx) {
    let toast = this.toastCtrl.create({
      message: "Producto eliminado",
      duration: 3000,
      position: "long"
    });

    this.providerServ
      .deleteProducto(idx)
      .then((exixte: any) => {
        slidingItem.close();
        this.cargarProductos();
      })
      .catch(err => {
        this.alertCtrl
          .create({
            title: "Producto no eliminado",
            subTitle: "Inteta de nuevo",
            buttons: ["Aceptar"]
          })
          .present();
      });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  NodeleteProducto() {
    const alert = this.alertCtrl.create({
      subTitle: "¡ No puedes dejar un pedido sin productos !",
      buttons: ["Aceptar"]
    });
    alert.present();
  }

  productEditModal(idx) {
    const modal = this.modalCtrl.create(ModalProductPage, {
      producto: idx,
      pedidoID: this.idPedido,
      servicioID: this.servicioID
    });
    modal.present();
  }

  productModal() {
    const modal = this.modalCtrl.create(ModalProductPage, {
      pedidoID: this.idPedido,
      servicioID: this.servicioID
    });
    modal.present();
  }
}
