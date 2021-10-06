import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  App,
  ViewController,
  MenuController
} from "ionic-angular";
import { Observable } from "rxjs/Observable";

import { ServicesProvider } from "../../providers/services/services";
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-service",
  templateUrl: "service.html"
})
export class ServicePage {
  servicioID: any;
  pedidos: any;
  productos: Observable<any[]>;
  service: any;
  anonimo: any;
  CANCELP: string;
  AMOUNT: string;
  DELETEP: string;
  YES : string;
  NO : string;
  CANCEL: string; 
  OK: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appCtrl: App,
    public providerServ: ServicesProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public _serviceProvider: ServicesProvider,
    public authFire: AngularFireAuth,
    public trnaslateService: TranslateService
  ) {
    this.CANCELP = trnaslateService.instant('SERV.CANCELP');
    this.AMOUNT = trnaslateService.instant('SERV.AMOUNT');
    this.DELETEP = trnaslateService.instant('SERV.DELETEP');
    this.YES = trnaslateService.instant('BOTTONS.YES');
    this.NO = trnaslateService.instant('BOTTONS.NO');
    this.CANCEL = trnaslateService.instant('BOTTONS.CANCEL');
    this.OK = trnaslateService.instant('BOTTONS.OK');
    

    this.anonimo = localStorage.getItem("anonimo");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ServicePage");
    this.menu.enable(false); // Enable sidemenu

    this.servicioID = localStorage.getItem("servicioID");
    console.log("Este es el id del servicio: ", this.servicioID);

    this.loadPedidos(this.servicioID);
  }

  goBack() {
    const confirm = this.alertCtrl.create({
      message: this.CANCELP,
      buttons: [
        {
          text: this.NO,
          handler: () => {
            console.log("Clic en Mantenerse");
          }
        },
        {
          text: this.YES,
          handler: () => {
            this.navCtrl.setRoot("HomePage");
            let servicioID = localStorage.getItem("servicioID");
            let pedidoID = localStorage.getItem("pedidoID");
            this._serviceProvider.deletServicePQ(servicioID, pedidoID);
            localStorage.removeItem("servicioID");
            localStorage.removeItem("servicio");
            localStorage.removeItem("pedido");
            localStorage.removeItem("pedidoID");
            localStorage.removeItem("producto");
          }
        }
      ]
    });
    confirm.present();
  }

  loadPedidos(servicioID) {
    this.providerServ.getAllPedidosPQ(servicioID).subscribe(pedidos => {
      console.log("Estos son los pedidso: ", pedidos);
      this.pedidos = pedidos;
    });
  }

  goProductos(idx) {
    console.log("pedido: ", idx);

    const modal = this.modalCtrl.create("ProductsPage", { pedido: idx });
    modal.present();
  }

  addPedido() {
    localStorage.removeItem("pedido");
    localStorage.removeItem("pedidoID");
    localStorage.removeItem("producto");
    localStorage.setItem("pedidoN", "nuevo");   

    const confirm = this.alertCtrl.create({
      message: this.AMOUNT,
      buttons: [
        {
          text: this.OK,
          handler: () => {
            const modal = this.modalCtrl.create("PlacePage", {
              servicioID: this.servicioID,
              page: "map"
            });
            modal.present();
          }
        },
        {
          text: this.CANCEL,
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();  
  }

  deletePedido(servicioID, pedidoID, nombreLocal, totalPedido, slidingItem) {
    console.log("Resultados: ", servicioID, pedidoID, nombreLocal, totalPedido);

    let alert = this.alertCtrl.create({
      title: nombreLocal,
      message: this.CANCELP,
      buttons: [
        {
          text: this.NO,
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: this.YES,
          handler: () => {
            console.log("Acept clicked");
            if (totalPedido == 1) {
              this.providerServ.deletServicePQ(servicioID, pedidoID);
              slidingItem.close();
              this.navCtrl.setRoot("HomePage", [], {
                animation: "md-transition",
                animate: true,
                direction: "down"
              });
              localStorage.removeItem("servicio");
              localStorage.removeItem("servicioID");
              localStorage.removeItem("pedido");
              localStorage.removeItem("pedidoID");
              localStorage.removeItem("producto");
            } else {
              this.providerServ.deletServicePedidoPQ(servicioID, pedidoID);
              this.loadPedidos(servicioID);
            }
          }
        }
      ]
    });
    alert.present();
  }

  goToSummary(anonimo) {
    if (anonimo != "true") {
      this.navCtrl.setRoot(
        "SummaryPage",
        {
          servicioID: this.servicioID
        },
        {
          animation: "md-transition",
          animate: true,
          direction: "down"
        }
      );
    } else {
      this.authFire.auth.signOut().then(() => {
        this.navCtrl.setRoot("FirstLandingPage");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("uid");
        localStorage.removeItem("anonimo");
        localStorage.removeItem("uidSucursal");
        localStorage.removeItem("uidSucursal");
        localStorage.removeItem("pedidoID");
        localStorage.removeItem("carrito");
        localStorage.removeItem("pedidoRes");
        localStorage.removeItem("servicioID");
        localStorage.removeItem("restaurante");
        localStorage.removeItem("servicio");
        localStorage.removeItem("checked");
        localStorage.removeItem("pedido");
        localStorage.removeItem("producto");
        localStorage.removeItem('banners');
        localStorage.removeItem("datos");
      });
    }
  }
}
