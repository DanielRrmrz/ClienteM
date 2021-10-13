/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 *
 * This file represents a component of Payment page
 * File path - '../../../../src/pages/payment/payment'
 */

import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ToastController,
  LoadingController,
  AlertController,
} from "ionic-angular";
import { ServicesProvider } from "../../providers/services/services";
import * as CryptoJS from "crypto-js";
import { Stripe } from "@ionic-native/stripe";
import { Http, Headers, RequestOptions } from "@angular/http";
import { CardProvider } from "../../providers/card/card";
import { SettingsProvider } from "../../providers/settings/settings";

@IonicPage()
@Component({
  selector: "page-payment",
  templateUrl: "payment.html",
})
export class PaymentPage {
  @ViewChild("map") mapElement: ElementRef;

  serviceID: any;
  servicio: any = {};
  pedidos: any;
  _inicio: any;
  _termino: any;
  totalTime: any;
  numPedidos: number;
  total: number;
  comision: number;
  granTotal: number;
  card: any = {};
  dataCard: any = {};
  tarjeta: any = {};
  arranque: any;
  tarifa: any;
  record: any;

  tarifaTime: any;
  tarifaKM: any;
  puntos: any;
  origen: any;
  destino: any;
  totalKm: any;
  type: any;
  km: any;
  message: any = false;
  totalLugares: any;
  recargos: any;

  cobrar: any;
  totalProd: number = 0.0;
  totalProd1: number = 0.0;
  comisionServicio: number = 0.0;
  totComision: number = 0.0;
  totalF: number = 0.0;
  totalFinal: number = 0.0;
  corteBme: number = 0.0;
  corteRep: number = 0.0;
  idSucursal: number = 0.0;
  metodo_pago: number = 0.0;
  porcentaje: number = 0.0;

  public destination: any;
  public origin: any;
  public driving: any = "DRIVING";
  public map: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public _providerServ: ServicesProvider,
    public _providerCard: CardProvider,
    public _providerSeti: SettingsProvider,
    public stripe: Stripe,
    public http: Http,
    public loadinCtl: LoadingController,
    public alertCtrl: AlertController
  ) {
    // this.serviceID = "gSweN9DckRbqg0KO8IFk";
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PaymentPage");
    this.serviceID = this.navParams.get("serviceID");
    this.record = this.navParams.get("records");
    this.km = localStorage.getItem("km");

    this._providerServ.getOneServicio(this.serviceID).subscribe((servicio) => {
      if (servicio != null) {
        if (servicio.metodo_pago == "Efectivo" && servicio.cambio == "cambio") {
          this.getService();
          console.log('si entro');
        }else {
          console.log('no entro');
          
        }
      }else{
        console.log('Serv 1 null');
      }      
    });

    this.getServiceEstatus(this.serviceID);
    this.getPedidos(this.serviceID);
    setTimeout(() => {
      this.getService();
    }, 1000);
  }

  goBack() {
    this.navCtrl.pop();
  }

  goDetallePedido(key) {
    const modal = this.modalCtrl.create("ModalDetallePedidoPage", {
      pedidoID: key,
    });
    modal.present();
  }

  getServiceEstatus(idS: string) {
    this._providerServ.getOneServicio(idS).subscribe((servicio: any) => {
      if (!servicio) {
        // console.log("respuesta 1");
        this.servicio = "";
        this.type = "";
      } else {
        // console.log("respuesta 2");
        this.servicio = servicio;
        this.type = servicio.tipo;

        if (
          this.servicio.estatus == "Pagado" &&
          this.servicio.metodo_pago == "Efectivo" &&
          this.record != true
        ) {
          this.modalCalifica();
        }

        if (
          this.servicio.estatus == "Terminado" &&
          this.servicio.metodo_pago == "Efectivo" &&
          this.record != true
        ) {
          this.modalCalifica();
        }

        if (
          this.servicio.estatus == "Pagado" &&
          this.servicio.metodo_pago == "Tarjeta" &&
          this.record != true
        ) {
          this.modalCalifica();
        }

        if (
          this.servicio.estatus == "Terminado" &&
          this.servicio.metodo_pago == "Tarjeta" &&
          this.record != true
        ) {
          this.modalCalifica();
        }

        if (this.servicio.status == "error_funds") {
          this.message =
            "Fondos insuficientes, por favor intente con otra tarjeta o cambie forma de pago a efectivo.";
        }

        if (this.servicio.status == "error_honor") {
          this.message =
            "Por favor intente con otra tarjeta o cambie forma de pago a efectivo.";
        }

        if (this.servicio.status == "error_declined") {
          this.message =
            "Tarjeta rechazada, ocurrio un problema con su tarjeta de debito o credito, porfavor intente de nuevo o cambie su forma de pago.";
        }

        if (this.servicio.status == "transaction_not_allowed") {
          this.message =
            "Tarjeta rechazada, ocurrio un problema con su tarjeta de debito o credito, porfavor intente de nuevo o cambie su forma de pago.";
        }
      }
    });
  }

  getService() {
    const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/cobrar/${this.serviceID}`;
    this.http.get(url).subscribe((res) => {
      const cargo = res.json().cargo;
      this.cobrar = cargo;
      if (this.cobrar) {
        console.log("Cobrar Respuesta:", cargo);
        this.totalProd = cargo.totalProd;
        this.totalProd1 = cargo.totalProd1;
        this.comisionServicio = cargo.comisionServicio - cargo.recargos;
        this.totalFinal = cargo.totalFinal;
        this.totComision = cargo.totComision;
        this.corteBme = cargo.corteBme;
        this.corteRep = cargo.corteRep;
        this.totalLugares = cargo.totalLugares;
        this.recargos = cargo.recargos;
        this.porcentaje = cargo.porcentaje;
        setTimeout(() => {
          this._providerServ.insertarTotales(
            this.serviceID,
            cargo.totComision,
            cargo.corteBme,
            cargo.corteRep,
            cargo.totalProd1,
            this.comisionServicio,
            cargo.totalFinal,
            this.porcentaje
          );
        }, 3000); 
      } else {
        console.log("Cobrar Respuesta:", cargo);
      }
    });
  }

  getPedidos(idS: string) {
    if (idS != undefined) {
      this._providerServ._getAllPedidosPQ(idS).then((e: any) => {
        if (!e) {
          console.log('respuesta 1');          
        } else {
          console.log('respuesta 2');
          this.pedidos = e;
          this.numPedidos = e.length; 
        }
      }); 
    } else {  
      console.log('idServicio undefined');
    }
  }

  payment(cardID, clave, metodo_pago) {
    let loading = this.loadinCtl.create({
      spinner: "bubbles",
      content: "Procesando pago.",
    });

    loading.present();

    let cliente = "Cliente";
    this._providerServ.updateStatusTermino(this.serviceID, cliente);

    if (metodo_pago == "Tarjeta") {
      this._providerCard.getOneCard(cardID).then((Card) => {
        this.tarjeta = Card;

        let granTotal = this.granTotal.toFixed(2);
        let amount = (Number(granTotal) * 100).toFixed(0);

        console.log("Este es el monto: ", amount);

        //Tarjeta
        var Tarjetabytes = CryptoJS.AES.decrypt(this.tarjeta.number, "number");
        var tarjetaData = JSON.parse(Tarjetabytes.toString(CryptoJS.enc.Utf8));
        const tarjetaConsultada = JSON.stringify(tarjetaData);
        console.log("Esta es la tarjeta: ", tarjetaConsultada);

        //Mes
        var expMonthFechabytes = CryptoJS.AES.decrypt(
          this.tarjeta.expMonth,
          "expMonth"
        );
        var expMonthData = JSON.parse(
          expMonthFechabytes.toString(CryptoJS.enc.Utf8)
        );
        const expMonthConsultada = JSON.stringify(expMonthData);
        // alert("Esta es la mes: " + expMonthConsultada);

        //Año
        var expYearFechabytes = CryptoJS.AES.decrypt(
          this.tarjeta.expYear,
          "expYear"
        );
        var expYearData = JSON.parse(
          expYearFechabytes.toString(CryptoJS.enc.Utf8)
        );
        const expYearConsultada = JSON.stringify(expYearData);
        console.log("Esta es la año: ", expYearConsultada);

        //Codigo
        var Codigobytes = CryptoJS.AES.decrypt(this.tarjeta.cvc, "cvc");
        var codigoData = JSON.parse(Codigobytes.toString(CryptoJS.enc.Utf8));
        const codigoConsultado = JSON.stringify(codigoData);
        console.log("Esta es el codigo: ", codigoConsultado);

        const cardData = {
          number: tarjetaConsultada,
          expMonth: Number(expMonthConsultada),
          expYear: Number(expYearConsultada),
          cvc: codigoConsultado,
        };

        this.stripe.setPublishableKey("pk_live_7ZTQQUZjCuYfjy6mgy35Achh");
        this.stripe
          .createCardToken(cardData)
          .then((token) => {
            let headers = new Headers({
              "Content-Type": "application/json",
            });
            let options = new RequestOptions({ headers: headers });
            let url = "https://bringme-a412b.firebaseapp.com/timestamp";
            let data = JSON.stringify({
              cardToken: token.id,
              amount: amount,
              clave: clave,
            });

            this.http.post(url, data, options).subscribe((res) => {
              if (res.json().status == "succeeded") {
                let title = "¡ Pago con exito !";
                let message = "Por favor califica a tu repartidor";
                this.presentConfirmTarjeta(title, message, cardID);

                setTimeout(() => {
                  loading.dismiss();
                }, 1000);
              }

              const StripeDeclineCode = res.json().raw.decline_code;

              if (StripeDeclineCode == "insufficient_funds") {
                let error_funds = "error_funds";
                this._providerServ
                  .updateStatus(this.serviceID, error_funds)
                  .then((res: any) => {
                    if (res.success == true) {
                      setTimeout(() => {
                        loading.dismiss();
                      }, 1000);
                      this.message =
                        "Por favor intente con otra tarjeta o cambie forma de pago a efectivo.";
                    }
                  });
              }

              if (StripeDeclineCode == "do_not_honor") {
                let error_honor = "error_honor";
                this._providerServ
                  .updateStatus(this.serviceID, error_honor)
                  .then((res: any) => {
                    if (res.success == true) {
                      setTimeout(() => {
                        loading.dismiss();
                      }, 1000);
                      this.message =
                        "Por favor intente con otra tarjeta o cambie forma de pago a efectivo.";
                    }
                  });
              }
            });
          })
          .catch((error) => {
            // alert(error);
            let error_declined = "error_declined";
            this._providerServ
              .updateStatus(this.serviceID, error_declined)
              .then((res: any) => {
                if (res.success == true) {
                  setTimeout(() => {
                    loading.dismiss();
                  }, 1000);
                  this.message =
                    "Ocurrio un problema con su tarjeta de debito o credito, porfavor intente de nuevo o cambie su forma de pago.";
                }
              });
          });
      });
    }
  }

  presentConfirmTarjeta(title, message, cardID) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: "Aceptar",
          handler: () => {},
        },
      ],
    });
    alert.present();

    const corteBme = this.totalTime * 0.3;
    const corteRep = this.totalTime * 0.7;
    this._providerServ.updateComicion(
      this.serviceID,
      corteBme.toFixed(2),
      corteRep.toFixed(2),
      this.totalTime,
      this.total,
      this.granTotal,
      this.comision
    );
    this._providerServ.updateEstatus(this.serviceID);
    this._providerCard.updateChekedFalse(cardID);
    localStorage.removeItem("pago");
    localStorage.removeItem("pedidoID");
    localStorage.removeItem("pedido");
    localStorage.removeItem("producto");
    localStorage.removeItem("servicio");
    localStorage.removeItem("pedidoRes");
    localStorage.removeItem("restaurante");
    localStorage.removeItem("carrito");
    localStorage.removeItem("cardId");
    localStorage.removeItem("type");
    localStorage.removeItem("km");
    localStorage.setItem("califica", "true");
    this.navCtrl.setRoot("ModalCalificaPage", {
      serviceID: this.serviceID,
    });
  }

  presentDeclineCode() {
    const modal = this.modalCtrl.create("ModalPaymentMethodPage", {
      servicioID: this.serviceID,
      cambio: "cambio",
    });
    modal.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: "User was added successfully",
      duration: 3000,
      position: "top",
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  modalCalifica() {
    /* ++++++++++ Estatus Pagado ++++++++++++++ */
    localStorage.removeItem("pago");
    localStorage.removeItem("pedidoID");
    localStorage.removeItem("pedido");
    localStorage.removeItem("producto");
    localStorage.removeItem("servicio");
    localStorage.removeItem("pedidoRes");
    localStorage.removeItem("restaurante");
    localStorage.removeItem("carrito");
    localStorage.removeItem("cardId");
    localStorage.removeItem("type");
    localStorage.removeItem("km");
    localStorage.setItem("califica", "true");
    this.navCtrl.setRoot("ModalCalificaPage", {
      serviceID: this.serviceID,
    });
  }
}
