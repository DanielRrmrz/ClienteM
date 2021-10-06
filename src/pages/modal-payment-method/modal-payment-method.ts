import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { CardProvider } from "../../providers/card/card";
import { ServicesProvider } from "../../providers/services/services";
import { SettingsProvider } from "../../providers/settings/settings";

@IonicPage()
@Component({
  selector: "page-modal-payment-method",
  templateUrl: "modal-payment-method.html"
})
export class ModalPaymentMethodPage {
  cards: any;
  uid: any;
  Efectivo: any;
  Tarjeta: any;
  servicioID: any;
  checked: any;
  cardId: any;
  metodosPago: any;
  efectivo: any;
  tarjeta: any;
  cambio: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public _providerCard: CardProvider,
    public _providerService: ServicesProvider,
    public _providerSett: SettingsProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalPaymentMethodPage");
  }

  ngOnInit() {
    this.checked = localStorage.getItem("checked");
    this.servicioID = this.navParams.get("servicioID");
    this.cambio =  this.navParams.get("cambio");
    this.cardId = localStorage.getItem("cardId");
    this.uid = localStorage.getItem("uid");
    this.loadCards(this.uid);
    this.getMetodosPago();
    this._providerService.updateStatus(this.servicioID, "");
    this._providerService.updateStatusTermino(this.servicioID, "");
  }

  goBack() {
    this.navCtrl.pop();
  }

  addCard() {
    const modal = this.modalCtrl.create("ModalAddCardPage");
    modal.present();
  }

  loadCards(uid) {
    this._providerCard.getAllCards("card", uid).subscribe(e => {
      this.cards = e;
      console.log(this.cards);
    });
  }

  getMetodosPago() {
    this._providerSett.getMetodosPago().subscribe(e => {
      this.metodosPago = e;
      console.log("MetodosPago: ", this.metodosPago);

      this.metodosPago.forEach(data => {
        this.efectivo = data.Efectivo;
        console.log(this.efectivo);
        this.tarjeta = data.Tarjeta;
        console.log(this.tarjeta);
      });
    });
  }

  saveType(metodoPago, cardId, cardLast4, cardType, key) {
    if (metodoPago == "Tarjeta") {
      localStorage.setItem("checked", "false");
      localStorage.setItem("cardId", key);
      this._providerCard.updateCheked(key, cardId, metodoPago);
      this._providerService.updateMetodoPagoTarjeta(
        this.servicioID,
        metodoPago,
        key,
        cardLast4,
        cardType
      );
    } else if(metodoPago == "Efectivo") {
      localStorage.setItem("checked", "true");
      this._providerCard.updateCheked(key, cardId, metodoPago);
      this._providerService.updateMetodoPagoEfectivo(
        this.servicioID,
        metodoPago
      );
    }
    // else if(metodoPago == "Efectivo" && this.cambio == 'cambio') {
    //   localStorage.setItem("checked", "true");
    //   this._providerCard.updateCheked(key, cardId, metodoPago);
    //   this._providerService._updateMetodoPagoEfectivo(
    //     this.servicioID,
    //     metodoPago,
    //     this.cambio
    //   );
    // }

    this.navCtrl.pop();
  }
}
