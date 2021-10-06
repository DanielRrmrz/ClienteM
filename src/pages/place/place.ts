import { Component, NgZone, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  AlertController,
  App,
  LoadingController,
  Platform,
  ToastController,
  ModalController,
  Nav,
  MenuController,
} from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";

import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";

import { ModalProductPage } from "../modal-product/modal-product";
import { ServicesProvider } from "../../providers/services/services";
import { RegisterUserProvider } from "../../providers/register-user/register-user";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { TranslateService } from "@ngx-translate/core";

declare var google: any;

@IonicPage()
@Component({
  selector: "page-place",
  templateUrl: "place.html",
})
export class PlacePage {
  @ViewChild("map") mapElement: ElementRef;
  @ViewChild("searchbar", { read: ElementRef }) searchbar: ElementRef;
  @ViewChild(Nav) nav: Nav;

  db = firebase.firestore();

  addressElement: HTMLInputElement = null;

  listSearch: string = "";

  map: any;
  marker: any;
  loading: any;
  search: boolean = false;
  error: any;
  switch: string;

  regionals: any = [];
  currentregional: any;
  us: any = {};
  UserInfoGeo: any = {};
  uid: any;
  nombreUsuario: any;

  pedido: any = {};
  productos: any[] = [];
  pedidos: any[] = [];
  items: any[] = [];
  buttonDisabled: any;
  disable: any;
  getProductos: any;
  servicioID: any;
  pedidoData: any = {};

  titulo: any;
  titulo_: any;
  dire: string = null;
  buscar: any;
  classT: any = "titulo_serv";
  classC: any = "";
  photo: any;

  DC: String;
  PQ: String;
  INPUT1: string;
  INPUT2: string;
  LOAD: String;
  DELETEPROD: string;
  DELETENOTPRO: string;
  TRY: string;
  ok: string;

  load: any;
  regreso: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public app: App,
    public zone: NgZone,
    public platform: Platform,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public geolocation: Geolocation,
    public storage: Storage,
    public modalCtrl: ModalController,
    public providerServ: ServicesProvider,
    public userProvider: RegisterUserProvider,
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public menu: MenuController,
    public translateService: TranslateService
  ) {
    this.DC = translateService.instant("PLACE.DC");
    this.PQ = translateService.instant("PLACE.PQ");
    this.INPUT1 = translateService.instant("PLACE.INPUT1");
    this.INPUT2 = translateService.instant("PLACE.INPUT2");
    this.LOAD = translateService.instant("PLACE.LOADING");
    this.DELETEPROD = translateService.instant("PLACE.DELETEPROD");
    this.DELETENOTPRO = translateService.instant("PLACE.DELETENOTPRO");
    this.TRY = translateService.instant("PLACE.TRY");
    this.ok = translateService.instant("BOTTONS.OK");

    // this.platform.ready().then(() => this.loadMaps());
    this.menu.enable(false); // Enable sidemenu
    this.direEnd();

    if (localStorage.getItem("pedido") == null) {
      this.buttonDisabled = true;
    }

    this.switch = this.navParams.get("page");

    this.servicioID = this.navParams.get("servicioID");
    console.log("Servicio true: ", this.servicioID);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PlacePage");
    const uid = localStorage.getItem("uid");
    this.userProvider._getUser(uid).subscribe((user) => {
      this.nombreUsuario = user.username + " " + user.lastname;
      this.photo = user.photo;
      console.log("Usuario", this.nombreUsuario);
    });
  }

  viewPlace(id) {
    console.log("Clicked Marker", id);
  }

  loadMaps() {
    if (!!google) {
      // const _lat = localStorage.getItem("lat");
      // const _lng = localStorage.getItem("lng");
      // this.initializeMap(_lat, _lng);
      // this.initAutocomplete();
    } else {
      this.errorAlert(
        "Error",
        "Something went wrong with the Internet Connection. Please check your Internet."
      );
    }
  }

  errorAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: "OK",
          handler: (data) => {
            this.loadMaps();
          },
        },
      ],
    });
    alert.present();
  }

  mapsSearchBar(ev: any) {
    // set input to the value of the searchbar
    //this.search = ev.target.value;
    console.log(ev);
    const autocomplete = new google.maps.places.Autocomplete(ev);
    autocomplete.bindTo("bounds", this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, "place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: "Autocomplete returned place with no geometry",
          });
        } else {
          sub.next(place.geometry.location);
          sub.complete();
        }
      });
    });
  }

  initAutocomplete(): void {
    // reference : https://github.com/driftyco/ionic/issues/7223
    this.addressElement = this.searchbar.nativeElement.querySelector(
      ".searchbar-input"
    );
    this.createAutocomplete(this.addressElement).subscribe((location) => {
      console.log("Searchdata", location);

      let options = {
        center: location,
        zoom: 18,
      };
      this.map.setOptions(options);
      this.addMarker(location, "Destino");
    });
  }

  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const options = {
      componentRestrictions: { country: "mx" },
    };
    const autocomplete = new google.maps.places.Autocomplete(
      addressEl,
      options
    );
    autocomplete.bindTo("bounds", this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, "place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: "Autocomplete returned place with no geometry",
          });
        } else {
          if (this.servicioID != undefined) {
            console.log("El servisio no esta basio !!");

            console.log("Search Lat", place.geometry.location.lat());
            console.log("Search Lng", place.geometry.location.lng());
            console.log(place);

            let serviceID = this.servicioID;
            let servicePedido = localStorage.getItem("pedidoID");
            if (serviceID != null && servicePedido != null) {
              this.providerServ.deletServicePedidoPQ(serviceID, servicePedido);
              localStorage.removeItem("pedidoID");
              localStorage.removeItem("pedido");
              localStorage.removeItem("producto");
            } else {
              let loading = this.loadingCtrl.create({
                spinner: "bubbles",
                content: String(this.LOAD),
              });
              loading.present();
              this.buttonDisabled = false;
              this.pedido = {
                latPedido: place.geometry.location.lat(),
                lngPedido: place.geometry.location.lng(),
                placeName: place.name,
                placeDire: place.formatted_address,
                nombreUsuario: this.nombreUsuario,
              };
              sub.next(place.geometry.location);
              setTimeout(() => {
                loading.dismiss();
              }, 1000);
              //sub.complete();
            }
          } else {
            console.log("Search Lat", place.geometry.location.lat());
            console.log("Search Lng", place.geometry.location.lng());
            console.log(place);

            let serviceID = localStorage.getItem("servicioID");
            let servicePedido = localStorage.getItem("pedidoID");
            if (serviceID != null) {
              console.log("if 1");

              this.providerServ.deletServicePQ(serviceID, servicePedido);
              localStorage.removeItem("servicioID");
              localStorage.removeItem("servicio");
              localStorage.removeItem("pedidoID");
              localStorage.removeItem("pedido");
              /******************* Guardando servico  ********************/
              this.pedido = {
                latPedido: place.geometry.location.lat(),
                lngPedido: place.geometry.location.lng(),
                placeName: place.name,
                placeDire: place.formatted_address,
              };

              this.providerServ
                .saveServicePQ(false, this.nombreUsuario, this.photo)
                .then((res: any) => {
                  let loading = this.loadingCtrl.create({
                    spinner: "bubbles",
                    content: String(this.LOAD),
                  });
                  loading.present();
                  if (res.success == true) {
                    const servicioID = res.servicioID;
                    localStorage.setItem("servicioID", servicioID);
                    localStorage.setItem("servicio", "true");
                    localStorage.setItem("pedido", "true");
                    localStorage.setItem("checked", "true");
                    this.buttonDisabled = false;
                    setTimeout(() => {
                      loading.dismiss();
                    }, 1000);
                  }
                });
              sub.next(place.geometry.location);
            } else if (serviceID != null && servicePedido != null) {
              console.log("if 2");

              this.providerServ.deletServicePQ(serviceID, servicePedido);
              localStorage.removeItem("servicioID");
              localStorage.removeItem("servicio");
              localStorage.removeItem("pedidoID");
              localStorage.removeItem("pedido");
              localStorage.removeItem("producto");
            } else {
              console.log("if 3");

              this.pedido = {
                latPedido: place.geometry.location.lat(),
                lngPedido: place.geometry.location.lng(),
                placeName: place.name,
                placeDire: place.formatted_address,
                nombreUsuario: this.nombreUsuario,
              };

              this.providerServ
                .saveServicePQ(false, this.nombreUsuario, this.photo)
                .then((res: any) => {
                  let loading = this.loadingCtrl.create({
                    spinner: "bubbles",
                    content: String(this.LOAD),
                  });
                  loading.present();
                  if (res.success == true) {
                    const servicioID = res.servicioID;
                    localStorage.setItem("servicioID", servicioID);
                    localStorage.setItem("servicio", "true");
                    localStorage.setItem("pedido", "true");
                    localStorage.setItem("checked", "true");
                    this.buttonDisabled = false;
                    setTimeout(() => {
                      loading.dismiss();
                    }, 1000);
                  }
                });
              sub.next(place.geometry.location);
              //sub.complete();
            }
          }
        }
      });
    });
  }

  initializeMap(lat, lng) {
    let myLatlng = new google.maps.LatLng(lat, lng);

    let mapEle = this.mapElement.nativeElement;
    this.map = new google.maps.Map(mapEle, {
      center: myLatlng,
      animation: google.maps.Animation.DROP,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      styles: [],
      zoom: 17,
    });

    // let marker = new google.maps.Marker({
    //   position: myLatlng,
    //   title: "Hello World!"
    // });

    this.addMarker(myLatlng, "Mi Ubicación!");

    // To add the marker to the map, call setMap();
    // this.map.setZoom(17);
    // this.map.panTo(marker.position);
    // marker.setMap(this.map);
  }

  //Center zoom
  //http://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers
  choosePosition() {
    this.storage.get("lastLocation").then((result) => {
      if (result) {
        let actionSheet = this.actionSheetCtrl.create({
          title: "Last Location: " + result.location,
          buttons: [
            {
              text: "Reload",
              handler: () => {
                this.getCurrentPosition();
              },
            },
            {
              text: "Delete",
              handler: () => {
                this.storage.set("lastLocation", null);
                this.showToast("Location deleted!");
              },
            },
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {},
            },
          ],
        });
        actionSheet.present();
      } else {
        this.getCurrentPosition();
      }
    });
  }

  resizeMap() {
    setTimeout(() => {
      google.maps.event.trigger(this.map, "resize");
    }, 5000);
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

  // go show currrent location
  getCurrentPosition() {
    this.loading = this.loadingCtrl.create({
      content: "Buscando tu Ubicación ...",
    });
    this.loading.present();

    let locationOptions = { timeout: 10000, enableHighAccuracy: true };

    this.geolocation.getCurrentPosition(locationOptions).then(
      (position) => {
        this.loading.dismiss().then(() => {
          this.showToast("Ubicación encontrada!");

          console.log(position.coords.latitude, position.coords.longitude);
          let myPos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          let options = {
            center: myPos,
            zoom: 18,
          };
          this.map.setOptions(options);
          this.addMarker(myPos, "Mi Ubicación!");
        });
      },
      (error) => {
        this.loading.dismiss().then(() => {
          this.showToast("Ubicación no Encontrada. Porfavor enciende tu GPS!");

          console.log(error);
        });
      }
    );
  }

  toggleSearch() {
    if (this.search) {
      this.search = false;
    } else {
      this.search = true;
    }
  }

  addMarker(position, content) {
    console.log("Posisition: ", position);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position,
    });

    this.addInfoWindow(marker, content);
    return marker;
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content,
    });

    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  }

  goBack() {
    if (this.servicioID != undefined) {
      this.navCtrl.pop();
      let serviceID = this.servicioID;
      localStorage.removeItem("pedidoN");
      let servicePedido = localStorage.getItem("pedidoID");
      if (servicePedido != null) {
        this.providerServ.deletServicePedidoPQ(serviceID, servicePedido);
        localStorage.removeItem("pedido");
        localStorage.removeItem("pedidoID");
        localStorage.removeItem("producto");
      }
    } else {
      this.navCtrl.setRoot("HomePage", [], {
        animation: "md-transition",
        animate: true,
        direction: "down",
      });
      let serviceID = localStorage.getItem("servicioID");
      let servicePedido = localStorage.getItem("pedidoID");
      if (serviceID != null) {
        this.providerServ.deletServicePQ(serviceID, servicePedido);
        localStorage.removeItem("servicioID");
        localStorage.removeItem("pedido");
        localStorage.removeItem("pedidoID");
        localStorage.removeItem("producto");
        localStorage.removeItem("servicio");
      }
    }
  }

  buscador(event) {
    console.log("buscador: " + event.length);
    const num = event.length;
    if (num >= 1) {
      this.titulo = true;
    } else {
      this.titulo = false;
      let serviceID = localStorage.getItem("servicioID");
      let servicePedido = localStorage.getItem("pedidoID");
      let servicio = localStorage.getItem("servicio");

      if (serviceID != null && servicio == null) {
        this.providerServ.deletServicePQ(serviceID, servicePedido);
        localStorage.removeItem("servicioID");
        localStorage.removeItem("servicio");
        localStorage.removeItem("pedidoID");
        localStorage.removeItem("pedido");
        this.buttonDisabled = true;
      }
    }
  }

  input1(event: string) {
    const num = event.length;
    if (num >= 1) {
      console.log("input_false", event.length);
      this.buttonDisabled = false;
    } else {
      console.log("input_true", event.length);
      this.buttonDisabled = true;
    }
  }
  _titulo(titulo: string) {
    this.load = this.loadingCtrl.create({
      spinner: "bubbles",
      content: String(this.LOAD),
    });
    this.load.present();
    let serviceID = localStorage.getItem("servicioID");
    const num = titulo.length;
    if (num >= 1 && serviceID == null) {
      console.log("titulo_3: " + titulo.length);
      this.providerServ
        .saveServicePQ(true, this.nombreUsuario, this.photo)
        .then((res: any) => {
          if (res.success == true) {
            this.pedido = {
              latPedido: null,
              lngPedido: null,
              placeName: this.titulo_,
              placeDire: this.dire,
              nombreUsuario: null,
            };
            const servicioID = res.servicioID;
            localStorage.setItem("servicioID", servicioID);
            localStorage.setItem("servicio", "true");
            localStorage.setItem("pedido", "true");
            localStorage.setItem("checked", "true");
            this.buttonDisabled = false;
            this.savePedido();
          }
        });
    } else {
      this.pedido = {
        latPedido: null,
        lngPedido: null,
        placeName: this.titulo_,
        placeDire: this.dire,
        nombreUsuario: null,
      };
      console.log("titulo_4: " + titulo.length);
      this.savePedido();
    }
    if (num >= 1 && serviceID != null) {
      console.log("titulo_5: " + titulo.length);
      this.buttonDisabled = false;
    }
  }

  savePedido() {
    if (this.servicioID != undefined) {
      console.log("Pedido dentro de un servicio creado !!");
      let pedido = localStorage.getItem("pedido");
      if (pedido != "true") {
        const servicioID = this.servicioID;
        this.providerServ
          .savePedidoPQ(servicioID, this.pedido)
          .then((result: any) => {
            if (result.success == true) {
              console.log("Resultado save: ", result.pedidoID);
              this.cargarProductos(result.pedidoID);
              this.loadPedido(result.pedidoID);
              setTimeout(() => {
                this.load.dismiss();
              }, 1000);
            }
          });
      }
      localStorage.setItem("pedido", "true");
    } else {
      let pedidoID = localStorage.getItem("pedidoID");
      if (pedidoID == undefined) {
        const servicioID = localStorage.getItem("servicioID");
        this.providerServ
          .savePedidoPQ(servicioID, this.pedido)
          .then((result: any) => {
            if (result.success == true) {
              console.log("Resultado save: ", result.pedidoID);
              this.cargarProductos(result.pedidoID);
              this.loadPedido(result.pedidoID);
              setTimeout(() => {
                this.load.dismiss();
              }, 1000);
            }
          });
      }
    }
  }

  atras() {
    if (this.servicioID != undefined) {
      this.navCtrl.pop();
      let serviceID = this.servicioID;
      localStorage.removeItem("pedidoN");
      let servicePedido = localStorage.getItem("pedidoID");
      if (servicePedido != null) {
        this.providerServ.deletServicePedidoPQ(serviceID, servicePedido);
        localStorage.removeItem("pedido");
        localStorage.removeItem("pedidoID");
        localStorage.removeItem("producto");
      }
    } else {
      let serviceID = localStorage.getItem("servicioID");
      let servicePedido = localStorage.getItem("pedidoID");
      if (serviceID != null) {
        this.providerServ.deletServicePQ(serviceID, servicePedido);
        localStorage.removeItem("servicioID");
        localStorage.removeItem("pedido");
        localStorage.removeItem("pedidoID");
        localStorage.removeItem("producto");
        localStorage.removeItem("servicio");
      }
    }
  }

  cargarProductos(pedidoKey) {
    this.providerServ.getAllProductos("productos", pedidoKey).subscribe((e) => {
      this.getProductos = e;
      console.log("Productos: ", this.getProductos);
      if (this.getProductos.length == 0) {
        this.disable = true;
      } else {
        this.disable = false;
      }
    });
  }

  productModal() {
    const modal = this.modalCtrl.create(ModalProductPage);
    modal.present();
  }

  productModalServ(servicioID) {
    let pedidoID = localStorage.getItem("pedidoID");
    const modal = this.modalCtrl.create(ModalProductPage, {
      servicioID: servicioID,
      pedidoID: pedidoID,
    });
    modal.present();
  }

  productEditModal(idx) {
    const modal = this.modalCtrl.create(ModalProductPage, { producto: idx });
    modal.present();
  }

  deleteProducto(slidingItem, idx) {
    let toast = this.toastCtrl.create({
      message: this.DELETEPROD,
      duration: 3000,
      position: "long",
    });

    this.providerServ
      .deleteProducto(idx)
      .then((exixte: any) => {
        slidingItem.close();
      })
      .catch((err) => {
        this.alertCtrl
          .create({
            title: this.DELETENOTPRO,
            subTitle: this.TRY,
            buttons: [this.ok],
          })
          .present();
      });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  servicePage() {
    localStorage.removeItem("pedidoN");
    // const modal = this.modalCtrl.create(ServicePage);
    // modal.present();
    this.navCtrl.setRoot("ServicePage", [], {
      animation: "md-transition",
      animate: true,
      direction: "up",
    });
  }

  direStart() {
    let latlng = {
      lat: parseFloat(localStorage.getItem("latPedido")),
      lng: parseFloat(localStorage.getItem("lngPedido")),
    };

    let geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      {
        location: latlng,
      },
      function (results, status) {
        // si la solicitud fue exitosa
        if (status === google.maps.GeocoderStatus.OK) {
          // si encontró algún resultado.
          if (results[1]) {
            console.log(results[1].formatted_address);
            let dire = results[1].formatted_address;
            localStorage.setItem("direStart", dire);
          }
        }
      }
    );
  }

  loadPedido(idx) {
    this.providerServ.getOnePedido(idx).subscribe((pedido) => {
      this.pedidoData = pedido;
      if (this.pedidoData == null) {
        this.pedidoData = "";
      }
    });
  }

  direEnd() {
    let latlng = {
      lat: parseFloat(localStorage.getItem("lat")),
      lng: parseFloat(localStorage.getItem("lng")),
    };

    let geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      {
        location: latlng,
      },
      function (results, status) {
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
}
