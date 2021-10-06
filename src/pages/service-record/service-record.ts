import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, MenuController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
  selector: "page-service-record",
  templateUrl: "service-record.html"
})
export class ServiceRecordPage {
  servicios: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public _providerServ: ServicesProvider,
    public menu: MenuController
  ) {
    this.menu.enable(true); // Enable sidemenu
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ServiceRecordPage");
      const uid = localStorage.getItem("uid");
      this.loadServicios(uid);
  }


  loadServicios(uid) {
    this._providerServ.getAllServicios(uid).subscribe(service => {
      const serv = service;
      const svc = [];
      serv.forEach(s => {
        if (s.estatus != 'creando') {
          svc.push(s);
        }
      });
      this.servicios =  svc;
      if(this.servicios.length==0){
        console.log("El arreglo esta vacio");
      }else{
        console.log("Estos son los servicios: ",this.servicios );
        
      }
      // console.log("Estos son los servicios en el historial: ", );
    });
  }

  verMas(serviceID) {
    const modal = this.modalCtrl.create("PaymentPage", {
      serviceID: serviceID,
      records: true
    });
    modal.present();
  }
}
