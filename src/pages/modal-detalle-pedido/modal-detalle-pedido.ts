import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ServicesProvider } from "../../providers/services/services";

/**
 * Generated class for the ModalDetallePedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-modal-detalle-pedido",
  templateUrl: "modal-detalle-pedido.html"
})
export class ModalDetallePedidoPage {
  idx: any;
  pedido: any;
  img: any;
  total: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _providerServ: ServicesProvider
  ) {
    this.idx = this.navParams.get("pedidoID");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalDetallePedidoPage");
    this.loadPedido(this.idx);
  }

  goBack(){
    this.navCtrl.pop();
  }

  loadPedido(idx) {
    this._providerServ.getOnePedido(idx).subscribe(pedido => {
      this.pedido = pedido;
      this.img = this.pedido.ticket;
      console.log(this.img);
    });
  }
}
