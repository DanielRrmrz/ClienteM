import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController
} from "ionic-angular";

import { ServicesProvider } from "../../providers/services/services";
// import { Observable } from "rxjs/Observable";
import { SettingsProvider } from "../../providers/settings/settings";
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-summary",
  templateUrl: "summary.html"
})
export class SummaryPage {
  direEnd: any = {};
  direStart: any = {};
  serviceID: any = {};
  servicio: any = {};
  pedidos: any;
  imagenMoto: any;
  imagenCar: any;
  numPedidos: any;
  typeTransporte: any = "";
  metodosPago: any;
  efectivo: any;
  tarjeta: any;
  transporte: any;
  carro: any;
  moto: any;
  pedidoRes: any;
  restauranteId: any;
  foodCategory: any;
  estatus: any;
  uidCategoria: any;
  OK: string;
  COMM: string;
  TYPETRAN: string;
  TYPEPAYM: string;
  CARDPAYM: string;
  CASHPAYM: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public translateService: TranslateService,
    public _providerServ: ServicesProvider,
    public _providerSett: SettingsProvider
  ) {
    this.serviceID = this.navParams.get("servicioID");
    this.pedidoRes = this.navParams.get("typeService");
    this.restauranteId = this.navParams.get("restaurante");
    this.foodCategory = this.navParams.get("foodCategory");
    this.estatus = this.navParams.get("estatus");
    this.uidCategoria = this.navParams.get("uidCategoria");
    this.OK = translateService.instant('BOTTONS.OK');
    this.COMM = translateService.instant('SUMMARY.COMM');
    this.TYPETRAN = translateService.instant('SUMMARY.TYPETRAN');
    this.TYPEPAYM = translateService.instant('SUMMARY.TYPEPAYM');
    this.CARDPAYM = translateService.instant('SUMMARY.CARDPAYM');
    this.CASHPAYM = translateService.instant('SUMMARY.CASHPAYM');
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SummaryPage");
    this.getService();
    this.getPedidos();
    this.getMetodosPago();
    this.getTransporte();
  }

  goBack() {
    if (this.pedidoRes != "true") {
      this.navCtrl.setRoot("ServicePage", [], {
        duration: 1000,
        animation: "md-transition",
        animate: true,
        direction: "down"
      });
    } else if (this.pedidoRes == "true") {
      this.navCtrl.setRoot(
        "CartPage",
        {
          restaurante: this.restauranteId,
          foodCategory: this.foodCategory,
          estatus: this.estatus,
          uidCategoria: this.uidCategoria
        },
        {
          duration: 1000,
          animation: "md-transition",
          animate: true,
          direction: "down"
        }
      );
    }
  }

  getService() {
    this._providerServ.getOneServicio(this.serviceID).subscribe(servicio => {
      this.servicio = servicio;
    });
  }

  getPedidos() {
    this._providerServ.getAllPedidosPQ(this.serviceID).subscribe(e => {
      this.pedidos = e;
      this.numPedidos = e.length;
      console.log(this.pedidos);
    });
  }

  getDetails(): void {
    this._providerServ.getOneServicio(this.serviceID).subscribe(servicio => {
      this.servicio = servicio;
    });
  }

  getMetodosPago() {
    this._providerSett.getMetodosPago().subscribe(e => {
      this.metodosPago = e;
      console.log("MetodosPago: ", this.metodosPago);

      this.metodosPago.forEach(data => {
        if (data.Efectivo == false) {
  
          let message = this.CARDPAYM;
          this.presentDeclineCode(message);
        } else if (data.Tarjeta == false) {
  
          let message = this.CASHPAYM;
          this.presentDeclineCode(message);
        }
        this.efectivo = data.Efectivo;
        console.log(this.efectivo);
        this.tarjeta = data.Tarjeta;
        console.log(this.tarjeta);
      });
    });
  }

  getTransporte() {
    this._providerSett.getTransporte().subscribe(e => {
      this.transporte = e;
      console.log("Transporte: ", this.transporte);

      this.transporte.forEach(data => {
        this.carro = data.car;
        console.log(this.carro);
        this.moto = data.moto;
        console.log(this.moto);
      });
    });
  }

  openMap(lat, lng) {
    this.navCtrl.push("MapPage", {
      lat: lat,
      lng: lng,
      servicioID: this.serviceID
    });
  }

  clickMoto(valor) {
    this.imagenMoto = valor;
    this.imagenCar = false;
  }

  clickCar(valor) {
    this.imagenCar = valor;
    this.imagenMoto = false;
  }

  goToPaymentMethod() {
    const modal = this.modalCtrl.create("ModalPaymentMethodPage", {
      servicioID: this.serviceID
    });
    modal.present();
  }

  saveTransporte(typeTransporte) {
    this._providerServ.updateTipoTransporte(this.serviceID, typeTransporte);
    this.typeTransporte = typeTransporte;
  }

  confirmarPedido() {
    if (this.typeTransporte != "") {
      this._providerServ.updateService(this.serviceID, this.numPedidos);
      this.navCtrl.setRoot("ModalDeliveryPage", {
        serviceID: this.serviceID
      });
      localStorage.setItem("notificando", "true");
    } else {
      let message = this.TYPETRAN;
      this.presentDeclineCode(message);
    }
  }

  confirmarPedidoTarjeta(cardType) {
    if (this.typeTransporte != "" && cardType != null) {
      this._providerServ.updateService(this.serviceID, this.numPedidos).then((res: any) => {
        if (res.success == true) {
          this.navCtrl.setRoot("ModalDeliveryPage", {
            serviceID: this.serviceID
          });
          localStorage.setItem("notificando", "true");   
        }
      });
    } else if (this.typeTransporte == "") {
      let message = this.TYPETRAN;
      this.presentDeclineCode(message);
    } else if (cardType == null) {
      let message = this.TYPEPAYM;
      this.presentDeclineCode(message);
    }
  }

  alertaComision(metodo_pago) {
    if (metodo_pago == 'Tarjeta') {
      this.alertCtrl
        .create({
          subTitle: this.COMM,
          buttons: [this.OK]
        })
        .present();
    }
  }

  presentDeclineCode(message) {
    let alert = this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: this.OK,
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    alert.present();
  }
}
