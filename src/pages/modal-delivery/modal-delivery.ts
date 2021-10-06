import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  MenuController,
} from "ionic-angular";
import { ServicesProvider } from "../../providers/services/services";
import { CardProvider } from "../../providers/card/card";
import { RegisterUserProvider } from '../../providers/register-user/register-user';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-modal-delivery",
  templateUrl: "modal-delivery.html",
})
export class ModalDeliveryPage {
  serviceID: any;
  establecimiento: any;
  servicio: any = {};
  restaurante: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public platform: Platform,
    public _providerServ: ServicesProvider,
    public _providerCard: CardProvider,
    public _userPovider: RegisterUserProvider
  ) {
    this.menu.enable(false); // Enable sidemenu
    this.restaurante = localStorage.getItem("pedidoRes");
    this.serviceID = this.navParams.get("serviceID");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalDeliveryPage");
    this.getService(this.serviceID);
    if (this.restaurante != "true") {
      this.NotiSerRepa();
    }else{
      this.NotiSerEstablecimiento();
    }
  }

  getService(serviceID) {
    this._providerServ.getOneServicio(serviceID).subscribe((servicio) => {
      this.servicio = servicio;
      console.log(this.servicio.estatus);
      let estatus = this.servicio.estatus;
      if (
        estatus == "Aceptado" ||
        estatus == "Gestando" ||
        estatus == "BuscandoBme" ||
        estatus == "AceptaBme" ||
        estatus == "Yendo" ||
        estatus == "Comprando" ||
        estatus == "Comprado" ||
        estatus == "Enviando" ||
        estatus == "Llevandolo" ||
        estatus == "EnPuerta"
      ) {
        if (this.restaurante == "true") {
          this.navCtrl.setRoot("DeliveryRestaurantPage", {
            serviceID: serviceID,
            pedidoID: localStorage.getItem("pedidoID"),
          });
          localStorage.setItem("delivery", "true");
          localStorage.removeItem("notificando");
        }
        if (this.restaurante != "true") {
          this.navCtrl.setRoot("DeliveryTrackingPage", {
            serviceID: serviceID,
          });
          localStorage.setItem("delivery", "true");
          localStorage.removeItem("notificando");
        }
      } else if (estatus == "Cancelado" || estatus == "Terminado") {
        localStorage.removeItem("pedidoRes");
        localStorage.removeItem("restaurante");
        localStorage.removeItem("carrito");

        localStorage.removeItem("servicioID");
        localStorage.removeItem("servicio");
        localStorage.removeItem("pedido");
        localStorage.removeItem("pedidoID");
        localStorage.removeItem("producto");
        localStorage.removeItem("delivery");
        this.navCtrl.setRoot("ServiceRecordPage");
      }
    });
  }

  NotiSerRepa() {
    const uidSucursal = localStorage.getItem("uidSucursal");
    this._userPovider.getAllRepas("users", uidSucursal).then((repas: any) => {
      // console.log("Repas", repas);
      repas.forEach((arr: any) => {  
        console.log("RepasID", arr.playerID);   
        if (this.platform.is("cordova")) {
          let noti = {
            app_id: "3fcb50bf-10a1-46ba-a57f-b0964e58a522",
            include_player_ids: [arr.playerID],
            android_channel_id: "808b2ed4-53b4-4435-80cb-8c766ac05a22",
            data: { estatus: "" },
            contents: {
              en: 'Pide lo que quieras'
            },
            headings: { en: 'Nuevo pedido' }
          };
    
          window["plugins"].OneSignal.postNotification(
            noti,
            function(successResponse) {
              console.log("Notification Post Success:", successResponse);
            },
            function(failedResponse: any) {
              console.log("Notification Post Failed: ", failedResponse);
            }
          );
        } else {
          console.log("Solo funciona en dispositivos");
        }
      });
    });
  }

  NotiSerEstablecimiento() {
    const restaurante = localStorage.getItem("restaurante");
    this._userPovider.getUser(restaurante).then((rest: any) => {
      // console.log("Repas", repas);  
        console.log("restaurante", rest.playerID);   
        if (this.platform.is("cordova")) {
          let noti = {
            app_id: "be1d91a4-131d-4c3a-a533-65cea5ce9886",
            include_player_ids: [rest.playerID],
            android_channel_id: "690cd4f1-ed0d-4795-b994-c1017b7b7157",
            data: { estatus: "" },
            contents: {
              en: 'Establecimiento'
            },
            headings: { en: 'Nuevo pedido' }
          };
    
          window["plugins"].OneSignal.postNotification(
            noti,
            function(successResponse) {
              console.log("Notification Post Success:", successResponse);
            },
            function(failedResponse: any) {
              console.log("Notification Post Failed: ", failedResponse);
            }
          );
        } else {
          console.log("Solo funciona en dispositivos");
        }
    });
  }

  

  cancelar(cardID) {
    this._providerServ.updateEstatusCancelado(this.serviceID);
    if (cardID != null) {
      this._providerCard.updateChekedFalse(cardID);
    }
    localStorage.removeItem("notificando");
    localStorage.removeItem("pago");
    localStorage.removeItem("pedidoID");
    localStorage.removeItem("pedido");
    localStorage.removeItem("producto");
    localStorage.removeItem("servicio");
    localStorage.removeItem("pedidoRes");
    localStorage.removeItem("restaurante");
    localStorage.removeItem("carrito");
    localStorage.removeItem("servicioID");
    localStorage.removeItem("cardId");
    this.navCtrl.setRoot("ServiceRecordPage");
  }
}
