import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform
} from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { ServicesProvider } from "../../providers/services/services";
import { TranslateService } from '@ngx-translate/core';

declare var google: any;

@IonicPage()
@Component({
  selector: "page-map",
  templateUrl: "map.html"
})
export class MapPage {
  @ViewChild("map") mapElement: ElementRef;
  @ViewChild("searchbar", { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  map: any;
  lat: any;
  lng: any;
  lati: any;
  lngi: any;
  servicioID: any;
  dire: any;
  apto: any = '';
  buscador: any = '';
  DC: string;
  FLAT: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public zone: NgZone,
    public platform: Platform,
    public translateService: TranslateService,
    public _providerService: ServicesProvider
  ) {
    this.platform.ready().then(() => this.loadMaps());
    this.lat = this.navParams.get("lat");
    this.lng = this.navParams.get("lng");
    this.servicioID = this.navParams.get("servicioID");
    this.DC = translateService.instant('SUMMARY.AD');
    this.FLAT = translateService.instant('MAPPAGE.FLAT');
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MapPage");
  }

  goBack() {
    // if(this.dire != undefined)//Tibe
    // {
    //   this.navCtrl.pop();
    // }
    this.navCtrl.pop();
  }

  loadMaps() {
    if (!!google) {
      this.initializeMap();
      this.initAutocomplete();
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
          handler: data => {
            this.loadMaps();
          }
        }
      ]
    });
    alert.present();
  }

  initAutocomplete(): void {
    // reference : https://github.com/driftyco/ionic/issues/7223
    this.addressElement = this.searchbar.nativeElement.querySelector(
      ".searchbar-input"
    );
    this.createAutocomplete(this.addressElement).subscribe(location => {
      console.log("Searchdata", location);

      let options = {
        center: location,
        zoom: 18
      };
      this.map.setOptions(options);
      this.addMarker(location, "Mein gesuchter Standort");
    });
  }
  initializeMap() {
    const NEW_ZEALAND_BOUNDS = {
      north: -20.36,
      south: -57.35,
      west: 166.28,
      east: -175.81,
    };
    const AUCKLAND = { lat: -37.06, lng: 174.58 };
    this.zone.run(() => {
      const location = { lat: this.lat, lng: this.lng };
      var mapEle = this.mapElement.nativeElement;
      this.map = new google.maps.Map(mapEle, {
        center: location,
        // restriction: {
        //   latLngBounds: NEW_ZEALAND_BOUNDS,
        //   strictBounds: false,
        // },
        zoom: 18,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false
      });

      this.addMarker(location, "Mein gesuchter Standort");
    });
  }

  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    console.log('autoC:', autocomplete);
    
    autocomplete.bindTo("bounds", this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, "place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: "Autocomplete returned place with no geometry"
          });
        } else {
          console.log("Search Lat", place.geometry.location.lat());
          console.log("Search Lng", place.geometry.location.lng());
          console.log("Place: ", place);
          console.log("Format Add:", place.formatted_address);
          
          this.lati = place.geometry.location.lat();
          this.lngi = place.geometry.location.lng();
          this.dire = place.formatted_address;
          sub.next(place.geometry.location);
        }
      });
    });
  }

  addMarker(position, content) {
    console.log(position);
    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });
  }

  validLocation()
  {
    console.log(this.dire);
    if (this.dire != undefined) {
      console.log(this.lati);
      console.log(this.lngi);
        let cornersX:any [] = [20.69426,20.67403,20.6146,20.62041,20.62037,20.61932,20.61609,20.6178,20.62009,20.62025,20.62091,20.62067,20.6333,20.63658,20.64214,20.64294,20.64756,20.65041,20.65507,20.65779,20.65944,20.66342,20.66747,20.67139,20.67082,20.67357,20.67479,20.67798,20.678,20.68344,20.68394,20.68705,20.69085,20.6919,20.6909,20.69252,20.69423,20.69933,20.70956,20.71211,20.71203,20.70958,20.71219,20.71556,20.71588,20.72495,20.73643,20.73726,20.75157,20.75065,20.75109,20.75085,20.75414,20.75291,20.75474,20.75791,20.76114,20.7618,20.76339,20.76483,20.76322,20.76516,20.77049,20.77249,20.77372,20.7758,20.77533,20.77752,20.77439,20.77447,20.7652,20.76333,20.76088,20.7589,20.75735,20.75689,20.75322,20.75235,20.75205,20.75575,20.75741,20.75775,20.76295,20.76227,20.76586,20.76118,20.75306,20.75296,20.75196,20.75428,20.75422,20.75795,20.76088,20.76209,20.76417,20.76734,20.76562,20.76837,20.76766,20.76853,20.76891,20.76873,20.76885,20.77477,20.77566,20.77364,20.77444,20.77947,20.77861,20.77859,20.77686,20.78173,20.802,20.80158,20.80182,20.80091,20.78463,20.75957,20.7544,20.75328,20.75135,20.75071,20.75031,20.74741,20.74425,20.74419,20.7425,20.74333,20.74192,20.74158,20.72995,20.72969,20.72925,20.7312,20.70248,20.69819];
        let cornersY:any [] = [-103.45608,-103.454523,-103.42686,-103.42315,-103.42242,-103.42221,-103.41714,-103.41206,-103.41049,-103.40864,-103.40839,-103.40425,-103.40083,-103.39669,-103.39512,-103.39991,-103.3983,-103.39931,-103.39156,-103.39313,-103.39744,-103.40146,-103.40282,-103.40026,-103.39752,-103.39791,-103.40304,-103.40233,-103.40531,-103.40527,-103.40102,-103.40139,-103.39806,-103.39948,-103.40302,-103.40512,-103.40237,-103.39945,-103.40681,-103.4048,-103.39488,-103.39124,-103.37514,-103.35652,-103.34399,-103.33691,-103.33592,-103.34075,-103.33699,-103.33448,-103.33395,-103.33208,-103.33141,-103.32641,-103.32564,-103.3259,-103.32491,-103.32824,-103.3277,-103.33478,-103.33599,-103.33977,-103.34027,-103.34396,-103.34306,-103.34793,-103.34811,-103.35345,-103.35586,-103.3565,-103.36219,-103.36687,-103.36693,-103.37134,-103.37176,-103.37372,-103.37445,-103.37582,-103.37825,-103.3784,-103.3804,-103.38308,-103.38248,-103.38671,-103.38853,-103.40108,-103.40042,-103.40344,-103.4099,-103.41286,-103.41565,-103.41529,-103.4151,-103.41653,-103.4168,-103.41971,-103.42269,-103.42604,-103.42705,-103.42814,-103.43443,-103.43509,-103.43921,-103.43962,-103.44018,-103.44179,-103.44518,-103.44643,-103.45128,-103.45422,-103.45611,-103.46299,-103.45773,-103.45998,-103.46282,-103.47709,-103.47704,-103.44054,-103.4425,-103.43976,-103.4401,-103.43761,-103.43763,-103.42895,-103.43003,-103.44359,-103.44359,-103.43235,-103.43254,-103.43072,-103.4313,-103.43422,-103.43608,-103.4516,-103.46019,-103.45737];
  
          var x = this.lati;
          var y = this.lngi;
          var arreglo = [[cornersX,cornersY]];
    
          if(this.containLocation(x,y,arreglo)){
            console.log("Direccion aceptada");
            this.saveDire();
          }else{
            console.log("zona invalida");
                let alert = this.alertCtrl.create({
                  title: 'Fuera de zona de cobertura',
                  message: 'La direccion ingresada está fuera del área de reparto',
                  buttons: [
                    {
                      text: 'ok',
                      role: 'cancel',
                      handler: () => {
                        console.log('Cancel clicked');
                      }
                    },
                    
                  ]
                });
                alert.present();
          }
    }
  }
  containLocation(x:any,y:any,arreglo:any[]){
    let result:boolean;
    for(let i=0;i<arreglo.length;i++){
      if(this.checkPointInPoly(x, y,arreglo[i][0] ,arreglo[i][1])){
        result = true;
        break;
      }
    }
    return result;
  }
  checkPointInPoly(x: any, y: any, cornersX: any, cornersY: any) {
    var i,
      j = cornersX.length - 1;
    var oddNodes = false;

    var polyX = cornersX;
    var polyY = cornersY;

    for (i = 0; i < cornersX.length; i++) {
      if (
        ((polyY[i] < y && polyY[j] >= y) ||
          (polyY[j] < y && polyY[i] >= y)) &&
        (polyX[i] <= x || polyX[j] <= x)
      ) {
        oddNodes = (polyX[i] +
          ((y - polyY[i]) / (polyY[j] - polyY[i])) *
          (polyX[j] - polyX[i]) <
          x);
      }
      j = i;
    }
    return oddNodes
  }
  saveDire(){
    
    console.log('direccion', this.dire);

    if (this.dire != undefined) {
      console.log(this.lati);
      console.log(this.lngi);
    //   if (this.lngi != -103.3900812 && this.lati != 20.75930649999999)
    //   {
    // let alert = this.alertCtrl.create({
    //   title: 'Zona invalida',
    //   message: 'La zona de envio seleccionada no es valida',
    //   buttons: [
    //     {
    //       text: 'No',
    //       role: 'cancel',
    //       handler: () => {
    // //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Si',
    //       handler: () => {
    // //         console.log('Yes clicked');
    //       }
    //     }
    //   ]
    // });
    // alert.present();
    //   }
      this._providerService.updateLocationEntrega(
        this.lati,
        this.lngi,
        this.servicioID,
        this.dire,
        this.apto
        
      ); 
      this.goBackListo();
    }else{
      // this._providerService._updateLocationEntrega(
      //   this.servicioID,
      //   this.buscador,
      //   this.apto
      // );
      this.goBackListo();
    }
  }

  goBackListo() {
    this.navCtrl.pop();
  }
}

//Cambios Mario
