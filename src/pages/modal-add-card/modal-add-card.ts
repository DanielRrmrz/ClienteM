import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { Stripe } from "@ionic-native/stripe";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { CardProvider } from "../../providers/card/card";
import * as CryptoJS from "crypto-js";
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-modal-add-card",
  templateUrl: "modal-add-card.html"
})
export class ModalAddCardPage {
  myForm: FormGroup;
  data: any = {};
  itemsCard: any[] = [];
  card: any = "";
  cardNum: any;
  cardNumero: any;
  cardMonth: any;
  cardYear: any;
  cardExpiryDate: any;
  cardCvc: any;
  respuestaCard: any;
  respuestaCardExpiryDate: any;
  respuestaCardCvc: any;
  CARDNUM : string;
  CARDINVALID : string;
  DATEINVALID : string;
  CODEINVALID : string;
  GOODCARD : string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public stripe: Stripe,
    public formBuilder: FormBuilder,
    public _providerCard: CardProvider,
    public toastCtrl: ToastController,
    public translateService: TranslateService
  ) {
    this.CARDNUM = translateService.instant('MODALPAY.CARDNUM'); 
    this.CARDINVALID = translateService.instant('MODALPAY.CARDINVALID');
    this.DATEINVALID = translateService.instant('MODALPAY.DATEINVALID');
    this.CODEINVALID = translateService.instant('MODALPAY.CODEINVALID');
    this.GOODCARD = translateService.instant('MODALPAY.GOODCARD');
    
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalAddCardPage");
  }

  ngOnInit() {
    this.stripe.setPublishableKey("pk_live_7ZTQQUZjCuYfjy6mgy35Achh");
    this.formValidation();
  }

  formValidation() {
    this.myForm = this.formBuilder.group({
      cardNum: ["", Validators.compose([Validators.required])],
      cardExpiryDate: new FormControl("", [Validators.required]),
      cardCvc: ["", Validators.compose([Validators.required])]
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  chaneCard(cardNum) {
    // separar numeros en sifras de 4
    let chIbn = cardNum
      .toString()
      .split(" ")
      .join("");
    if (chIbn.length > 0) {
      chIbn = chIbn.match(new RegExp(".{1,4}", "g")).join(" ");
    }
    this.cardNum = chIbn;
    // termina

    this.stripe
      .getCardType(cardNum)
      .then(cardType => {
        // alert('Bueno: ' + cardType);
        this.card = cardType;
        if (this.card == "Unknown") {
          this.card = "Desconocido";
        }
        this.cardNumber(cardNum);
      })
      .catch(error => {
        // alert('Malo:' + error);
        this.card = "error";
      });
  }

  cardNumber(cardNumber) {
    this.stripe
      .validateCardNumber(cardNumber.toString())
      .then(success => {
        // alert("Bueno: " + success);
        this.cardNumero = cardNumber;
        this.respuestaCard = "success";
      })
      .catch(error => {
        // alert("Malo: " + error);
        this.respuestaCard = "error";
      });
  }

  chageCardExpiryDate(cardExpiryDate) {
    // separar numeros en sifras de 2/2
    let chIbn = cardExpiryDate
      .toString()
      .split("/")
      .join("");
    if (chIbn.length > 0) {
      chIbn = chIbn.match(new RegExp(".{1,2}", "g")).join("/");
    }
    this.cardExpiryDate = chIbn;
    // termina

    let ExpiryDate = this.cardExpiryDate;
    this.cardMonth = Number(ExpiryDate.split("/")[0]);
    let ExpiryDate_ = this.cardExpiryDate;
    this.cardYear = Number(ExpiryDate_.split("/")[1]);

    console.log("Mes: ", this.cardMonth, "Año: ", this.cardYear);

    let mes = String(ExpiryDate.split("/")[0]);
    let anio = String(ExpiryDate.split("/")[1]);

    if (mes.toString().length == 2 && anio.toString().length == 2) {
      this.stripe
        .validateExpiryDate(mes, anio)
        .then(success => {
          // alert("Bueno: " + success);
          this.respuestaCardExpiryDate = "success";
        })
        .catch(error => {
          // alert("Malo: " + error);
          this.respuestaCardExpiryDate = "error";
        });
    }
  }

  changeCardCVC(cardCvc) {
    this.stripe
      .validateCVC(cardCvc)
      .then(success => {
        // alert("Bueno: " + success)
        this.respuestaCardCvc = "success";
      })
      .catch(error => {
        // alert("Malo: " + error);
        this.respuestaCardCvc = "error";
      });
  }

  rgistratTarjeta() {
    let cardNum = String(this.cardNum);
    console.log(cardNum.length);
    let cardMonth = String(this.cardMonth);
    console.log(cardMonth.length);
    let cardYear = String(this.cardYear);
    console.log(cardYear.length);
    let cardCvc = String(this.cardCvc);
    console.log(cardCvc.length);

    if (
      (cardNum.length == 19 &&
        this.respuestaCard == "success" &&
        cardMonth.length == 2) ||
      (1 &&
        cardYear.length == 2 &&
        this.respuestaCardExpiryDate == "success" &&
        cardCvc.length == 3 &&
        this.respuestaCardCvc == "success")
    ) {
      let cardNumber = String(this.cardNum);
      var sin_espacios = Number(cardNumber.replace(/ /g, ""));
      console.log("Sin espacios", sin_espacios);
      let cardLast4 = cardNumber.split(" ")[3];
      console.log("cardLast4", cardLast4);
      let cardCvc = Number(this.cardCvc);

      //Tarjeta
      var cardType = CryptoJS.AES.encrypt(
        JSON.stringify(sin_espacios),
        "number"
      );
      var cardTypeEncryptada = cardType.toString();
      console.log("number: ", cardTypeEncryptada);

      //Codigo de Seguridad
      var cvc = CryptoJS.AES.encrypt(JSON.stringify(cardCvc), "cvc");
      var cvcEncryptado = cvc.toString();
      console.log("cvc: ", cvcEncryptado);

      //expMonth
      var expMonth = CryptoJS.AES.encrypt(
        JSON.stringify(this.cardMonth),
        "expMonth"
      );
      var expMonthEncryptada = expMonth.toString();
      console.log("Fecha: ", expMonthEncryptada);

      //Año
      var expYear = CryptoJS.AES.encrypt(
        JSON.stringify(this.cardYear),
        "expYear"
      );
      var expYearEncryptada = expYear.toString();
      console.log("Fecha: ", expYearEncryptada);

      let card = {
        cardType: this.card,
        cardLast4: cardLast4,
        number: cardTypeEncryptada,
        expMonth: expMonthEncryptada,
        expYear: expYearEncryptada,
        cvc: cvcEncryptado
      };

      this._providerCard.cardRegistrar(card).then(data => {
        this.toastMensaje(this.GOODCARD);
        this.navCtrl.pop();
      });
    } else {
      if (cardNum.length < 19 || this.respuestaCard == "error") {
        this.toastMensaje(this.CARDINVALID);
      } else if (
        cardMonth.length < 2 ||
        this.respuestaCardExpiryDate == "error"
      ) {
        this.toastMensaje(this.DATEINVALID);
      } else if (
        cardYear.length < 2 ||
        this.respuestaCardExpiryDate == "error"
      ) {
        this.toastMensaje(this.DATEINVALID);
      } else if (cardCvc.length < 3 || this.respuestaCardCvc == "error") {
        this.toastMensaje(this.CODEINVALID);
      }
    }
  }

  toastMensaje(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      position: "bottom",
      duration: 3000
    });
    toast.present();
  }
}
