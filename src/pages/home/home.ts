import { Component } from "@angular/core";
import { RestaurantesProvider } from "../../providers/restaurantes/restaurantes";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  ModalController,
  AlertController
} from "ionic-angular";
import { ServicesProvider } from "../../providers/services/services";
import { PushProvider } from "../../providers/push/push";
import { SettingsProvider } from "../../providers/settings/settings";
import { UbicacionProvider } from "../../providers/ubicacion/ubicacion";
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

declare var google: any;

@IonicPage()

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  user: any = {};
  servicio: any;
  _servicio: any;
  servicio_: any;
  servicioID: any;
  pedidoID: any;
  serviceID: any;
  servicePedido: any;
  restaurante: any;
  banners: any;
  categorias: any;
  anonimo: any;
  latlng: any
  url: string;
  rootPage: any;
  PO: string;
  CONTINUE: string;
  CANCEL: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public restProvider: RestaurantesProvider,
    public _serviceProvider: ServicesProvider,
    public _pushProvider: PushProvider,
    public _providerSettings: SettingsProvider,
    public _ubicacionProv: UbicacionProvider,
    public nativestorage: NativeStorage,
    public platform: Platform,
    public iab: InAppBrowser,
    public translateService :TranslateService
  ) {
    this.PO = translateService.instant('HOME.PO');
    this.CONTINUE = translateService.instant('BOTTONS.CONTINUE');
    this.CANCEL = translateService.instant('BOTTONS.CANCEL');
    // this.menu.enable(true); // Enable sidemenu
    this.getBanners();

    if (this.platform.is("")) {
      this._servicio = nativestorage.getItem("servicio");
      this.anonimo = nativestorage.getItem("anonimo");
    } else {
      this._servicio = localStorage.getItem("servicio");
      this.anonimo = localStorage.getItem("anonimo");
    }
    if (this._servicio == "true") {
      this.servicio = "true";
    } else {
      this.servicio = "false";
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HomePage");
    this.menu.enable(true); // Enable sidemenu
    this.direEnd();
    this._pushProvider.get_id();
    // this._pushProvider.mensaje();
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter Home Page");
  }


    openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
    this.navCtrl.setRoot(page);
    }


  openRestaurante() {
    if (this.platform.is("")) {
      this.restaurante = this.nativestorage.getItem("restaurante");
      this.servicio = this.nativestorage.getItem("servicio");
    } else {
      this.restaurante = localStorage.getItem("restaurante");
      this.servicio = localStorage.getItem("servicio");
    }
    if (this.restaurante != null || this.servicio != null) {
      if (this.restaurante != null) {
        const confirm = this.alertCtrl.create({

          message:
            this.PO,
          buttons: [
            {
              text: this.CONTINUE,
              handler: () => {
                // this.rootPage = "CartPage";
                // this.navCtrl.setPages([
                //   { page: "CartPage", params: { estatus: 1 } }
                // ]);
                this.navCtrl.setRoot(
                  "CartPage",
                  { estatus: 1 },
                  {

                    animation: "md-transition",
                    animate: true,
                    direction: "up"
                  }
                );
                // console.log('Clic en Mantenerse');
              }
            },
            {
              text: this.CANCEL,
              handler: () => {
                if (this.platform.is("")) {
                  this.servicioID = this.nativestorage.getItem("servicioID");
                  this.pedidoID = this.nativestorage.getItem("pedidoID");
                } else {
                  this.servicioID = localStorage.getItem("servicioID");
                  this.pedidoID = localStorage.getItem("pedidoID");
                }
                this.restProvider.deleteAllProducts(
                  this.servicioID,
                  this.pedidoID
                );
                if (this.platform.is("")) {
                  this.nativestorage.remove("carrito");
                  this.nativestorage.remove("restaurante");
                  this.nativestorage.remove("pedidoRes");
                  this.nativestorage.remove("servicioID");
                  this.nativestorage.remove("pedidoID");
                } else {
                  localStorage.removeItem("carrito");
                  localStorage.removeItem("restaurante");
                  localStorage.removeItem("pedidoRes");
                  localStorage.removeItem("servicioID");
                  localStorage.removeItem("pedidoID");
                }
                // const modal = this.modalCtrl.create("FoodCategoriesPage");
                // modal.present();
                this.navCtrl.setRoot("ComerciosPage", [], {

                  animation: "md-transition",
                  animate: true,
                  direction: "up"
                });
              }
            }
          ]
        });
        confirm.present();
      } else {
        const confirm = this.alertCtrl.create({

          message:
            this.PO,
          buttons: [
            {
              text: this.CONTINUE,
              handler: () => {
                // this.rootPage = "CartPage";
                // const modal = this.modalCtrl.create("ServicePage", {
                //   service: "true"
                // });
                // modal.present();
                this.navCtrl.setRoot(
                  "ServicePage",
                  { service: "true" },
                  {

                    animation: "md-transition",
                    animate: true,
                    direction: "up"
                  }
                );
                // console.log('Clic en Mantenerse');
              }
            },
            {
              text: this.CANCEL,
              handler: () => {
                if (this.platform.is("")) {
                  this.serviceID = localStorage.getItem("servicioID");
                  this.servicePedido = localStorage.getItem("pedidoID");
                } else {
                  this.serviceID = localStorage.getItem("servicioID");
                  this.servicePedido = localStorage.getItem("pedidoID");
                }
                this._serviceProvider.deletServicePQ(
                  this.serviceID,
                  this.servicePedido
                );
                if (this.platform.is("")) {
                  this.nativestorage.remove("servicioID");
                  this.nativestorage.remove("servicio");
                  this.nativestorage.remove("pedidoID");
                  this.nativestorage.remove("pedido");
                  this.nativestorage.remove("producto");
                } else {
                  localStorage.removeItem("servicioID");
                  localStorage.removeItem("servicio");
                  localStorage.removeItem("pedidoID");
                  localStorage.removeItem("pedido");
                  localStorage.removeItem("producto");
                }
                this.navCtrl.setRoot("ComerciosPage", [], {

                  animation: "md-transition",
                  animate: true,
                  direction: "up"
                });
              }
            }
          ]
        });
        confirm.present();
      }
    } else {
      this.navCtrl.setRoot("ComerciosPage", [], {
        duration: 2000,
        animation: "md-transition",
        animate: true,
        direction: "up"
      });
    }
  }

  openMenu() {
    this.menu.open();
  }

  openPlace() {
    if (this.platform.is("")) {
      this.restaurante = this.nativestorage.getItem("restaurante");
    } else {
      this.restaurante = localStorage.getItem("restaurante");
    }

    if (this.restaurante != null) {
      const confirm = this.alertCtrl.create({

        message:
          this.PO,
        buttons: [
          {
            text: this.CONTINUE,
            handler: () => {
              // this.rootPage = "CartPage";
              // this.navCtrl.setPages([
              //   { page: "CartPage", params: { estatus: 1 } }
              // ]);
              this.navCtrl.setRoot(
                "CartPage",
                { estatus: 1 },
                {

                  animation: "md-transition",
                  animate: true,
                  direction: "up"
                }
              );
              // console.log('Clic en Mantenerse');
            }
          },
          {
            text: this.CANCEL,
            handler: () => {
              if (this.platform.is("")) {
                this.servicioID = this.nativestorage.getItem("servicioID");
                this.pedidoID = this.nativestorage.getItem("pedidoID");
              } else {
                this.servicioID = localStorage.getItem("servicioID");
                this.pedidoID = localStorage.getItem("pedidoID");
              }

              this.restProvider.deleteAllProducts(
                this.servicioID,
                this.pedidoID
              );
              if (this.platform.is("")) {
                this.nativestorage.remove("carrito");
                this.nativestorage.remove("restaurante");
                this.nativestorage.remove("pedidoRes");
                this.nativestorage.remove("servicioID");
                this.nativestorage.remove("pedidoID");
              } else {
                localStorage.removeItem("carrito");
                localStorage.removeItem("restaurante");
                localStorage.removeItem("pedidoRes");
                localStorage.removeItem("servicioID");
                localStorage.removeItem("pedidoID");
              }
              // const modal = this.modalCtrl.create("PlacePage", {
              //   page: "map"
              // });
              // modal.present();
              // this.navCtrl.push("PlacePage", {
              //   page: "map"
              // });
              this.navCtrl.setRoot(
                "PlacePage",
                { page: "map" },
                {

                  animation: "md-transition",
                  animate: true,
                  direction: "up"
                }
              );
            }
          }
        ]
      });
      confirm.present();
      // this.rootPage = "CartPage";
      // console.log("Debe ir a la página del carrito");
    } else {
      // const modal = this.modalCtrl.create("PlacePage", { page: "map" });
      // modal.present();
      this.navCtrl.setRoot(
        "PlacePage",
        { page: "map" },
        {

          animation: "md-transition",
          animate: true,
          direction: "up"
        }
      );
    }
  }

  direEnd() {
    
    this.latlng = {
      lat: parseFloat(localStorage.getItem("lat")),
      lng: parseFloat(localStorage.getItem("lng"))
    };

    let geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      {
        location: this.latlng
      },
      function(results, status) {
        // si la solicitud fue exitosa
        if (status === google.maps.GeocoderStatus.OK) {
          // si encontró algún resultado.
          if (results[1]) {
            console.log(results[1].formatted_address);
            let dire = results[1].formatted_address;
            localStorage.setItem("direEnd", dire);
          }
        }
      }
    );
  }

  goToService() {
    // const modal = this.modalCtrl.create("ServicePage", { service: "true" });
    // modal.present();
    this.navCtrl.setRoot(
      "ServicePage",
      { service: "true" },
      {

        animation: "md-transition",
        animate: true,
        direction: "up"
      }
    );
  }

  goToUrl(url: string){
    // const options = {
    //   toolbar: {
    //     height: 44,
    //     color: '#E36485'
    //   }
    // }
    const browser = this.iab.create(url, '_blank');
    browser.on('closePressed').subscribe(res => {
      browser.close();
    });
  }

  getBanners() {
    const banners = localStorage.getItem('banners');
    if (banners == undefined) {
      this._providerSettings.getBanners().subscribe(banners => {
        this.banners = banners;
        localStorage.setItem('banners', JSON.stringify(this.banners));
        console.log("Banners: ", this.banners);
      });
    }else{
      this.banners = JSON.parse(banners)
      // console.log("Banners 2", JSON.parse(banners));
    }

  }
}
