/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 *
 * This file represents a component of Delivery Tracking page
 * File path - '../../../../src/pages/delivery-tracking/delivery-tracking'
 */

import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, AlertController, MenuController } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
// import { MapStyle } from "../../assets/config/map-style";
import { ServicesProvider } from "../../providers/services/services";
import { RegisterUserProvider } from "../../providers/register-user/register-user";
import { CallNumber } from '@ionic-native/call-number';
// import { SplashScreen } from '@ionic-native/splash-screen';

declare var google;

@IonicPage()
@Component({
  selector: "page-delivery-restaurant",
  templateUrl: "delivery-restaurant.html"
})
export class DeliveryRestaurantPage {
  // @ViewChild("map") mapElement: ElementRef;
  MapStyle = [];

  markerOptions = {
    origin: {
      icon: "assets/imgs/bringmeLogo.png"
    },
    destination: {
      icon: "assets/imgs/bringmeCasa.png"
      // label: '',
      // opacity: 0.8,
    }
  };

  _Marker = {
    url: "assets/imgs/bringmePedido.png",
    scaledSize: {
      height: 40,
      width: 40
    },
    labelOrigin: new google.maps.Point(14, 14)
  };

  renderOptions: any;
  servicio: any = {};
  servicioInfo: any = {};
  pedido: any = {};
  serviceID: any;
  pedidoID: any;
  us: any = "";
  usInfo: any = "";
  tel: any;
  botones: boolean = true;

  zoom: number = 16;
  lat: any;
  lng: any;
  origin: any = { lat: 0, lng: 0 };
  destination: any = { lat: 0, lng: 0 };
  setDirections: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public geolocation: Geolocation,
    public platform: Platform,
    public callNumber: CallNumber,
    public alertCtrl: AlertController,
    // public splashScreen: SplashScreen,
    public _providerServ: ServicesProvider,
    public _providerUser: RegisterUserProvider
  ) {
    //  this.serviceID = "FfBGxNVYgooU7srIb4Y3";
    this.menu.enable(false, 'myMenu');
      this.menu.enable(false, 'myFONTS');
     // Disable sidemenu
    this.serviceID = this.navParams.get('serviceID');
    this.pedidoID = this.navParams.get("pedidoID");
    console.log('ServicioId', this.serviceID);
  }

  ionViewDidLoad() {
    // this.botonHome();
    this.getService();
    this._getService();
    this.loadPedido();
    this.loadmap_();
  }

  loadmap_() {
    this._providerServ.getOneServicio(this.serviceID).subscribe(servicio => {
      this.servicio = servicio;
      let uid = this.servicio.uidRepartidor;
      // console.log("Estes es el servicio", this.servicio);
      let destination = {
        lat: this.servicio.entregaGeo._lat,
        lng: this.servicio.entregaGeo._long
      };
      this.renderOptions = {
        suppressMarkers: true
      };
      if (this.servicio.uidRepartidor != "") {
        this.ubicacionRepartidor(uid, destination);
      }
    });
  }

  ubicacionRepartidor(uid, destination) {
    this._providerUser.ubicacionReparidor(uid);
    this._providerUser.repartidor.valueChanges().subscribe(user => {
      this.us = user;
      console.log('Repa localizador', this.us);
      if (this.us != undefined) {
        let origin = {
          lat: this.us.geolocalizacion._lat,
          lng: this.us.geolocalizacion._long
        };
        setTimeout(() => {
          this.agm_directions(origin, destination);
        }, 3000);
      }
    });
  }

  agm_directions(origin, destination) {
    this.origin = origin;
    this.destination = destination;
  }

  getService() {
    this._providerServ.getOneServicio(this.serviceID).subscribe(servicio => {
      this.servicio = servicio;
      // console.log(this.servicio);
      if (this.servicio.uidRepartidor != null) {
        this.getRepartidor(this.servicio.uidRepartidor);
        this._getRepartidor(this.servicio.uidRepartidor);
        this.botones = false;
      }
      let estatus = this.servicio.estatus;
      if (estatus == "Pago") {
        this.navCtrl.setRoot("PaymentPage", {
          serviceID: this.serviceID
        });
        localStorage.setItem("type", this.servicio.tipo);
        localStorage.setItem("km", this.servicio.km);
        localStorage.setItem("pago", "true");
        localStorage.removeItem("delivery");
      }
      if (
        this.servicio.estatus == "Pagado" &&
        this.servicio.metodo_pago == "Efectivo"
      ) {
        this.modalCalifica();
      }

      if (
        this.servicio.estatus == "Terminado" &&
        this.servicio.metodo_pago == "Efectivo"
      ) {
        this.modalCalifica();
      }

      if (
        this.servicio.estatus == "Pagado" &&
        this.servicio.metodo_pago == "Tarjeta"
      ) {
        this.modalCalifica();
      }

      if (
        this.servicio.estatus == "Terminado" &&
        this.servicio.metodo_pago == "Tarjeta"
      ) {
        this.modalCalifica();
      }

      if (this.servicio.estatus == "Cancelado") {
        this.opcionesCancelado();
      }
    });
  }

  _getService(){
    this._providerServ.getOneService(this.serviceID).then(s => {
      this.servicioInfo = s;
    });
  }

  getRepartidor(uid) {
    this._providerUser._getUser(uid).subscribe(user => {
      this.us = user;
      // console.log(this.us);
    });
  }

  _getRepartidor(uid) {
    this._providerUser.getUser(uid).then(user => {
      this.usInfo = user;
      this.tel = this.usInfo.phone;
    });
  }

  loadPedido() {
    this._providerServ.getOnePedido(this.pedidoID).subscribe(pedido => {
      this.pedido = pedido;
      // console.log("Por que no sale el pedido", this.pedido);

      this.lat = this.pedido.pedidoGeo._lat;
      this.lng = this.pedido.pedidoGeo._long;
    });
  }

  _chat(playerIDRepartidor) {
    const uid = localStorage.getItem("uid");
    this.navCtrl.push("Chat", {
      serviceID: this.serviceID,
      userID: uid,
      repaID: this.servicio.uidRepartidor,
      playerIDRepartidor: playerIDRepartidor
    });
  }

  _callNumber(tel) {
    this.callNumber
      .callNumber(tel.toString(), true)
      .then(res => console.log("Launched dialer!", res))
      .catch(err => console.log("Error launching dialer", err));
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
    localStorage.setItem("califica", "true");
    localStorage.removeItem("delivery");
    this.navCtrl.setRoot("ModalCalificaPage", {
      serviceID: this.serviceID
    });
  }

  opcionesCancelado() {
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

  // botonHome() {
  //   if (this.serviceID == undefined || this.serviceID == null || this.serviceID == '') {
  //     this.splashScreen.show();
  //     location.reload();
  //   }
  // }
}
