import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ToastController,
  MenuController
} from "ionic-angular";

import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ServicesProvider } from "../../providers/services/services";
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-modal-product",
  templateUrl: "modal-product.html"
})
export class ModalProductPage {
  currentNumber = 0;
  myForm: FormGroup;

  nota: any = "";
  _nota: any = "";
  items: any[] = [];
  idx: any;
  producto: any;
  servicoID: any;
  pedidoID: any;

  _producto: string;
  _descripcion: string;
  TITLE_: string;
  SUBTITLE_: string;
  NOTADDPRO: string;
  TRY: string;
  UPDATEPRO: string;
  ok: string;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public providerServ: ServicesProvider,
    public loadinCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public menu: MenuController,
    public trnaslateService: TranslateService
  ) {
    this._producto = trnaslateService.instant('MODPRODUCT.PROD');
    this._descripcion = trnaslateService.instant('MODPRODUCT.DES');
    this.NOTADDPRO = trnaslateService.instant('MODPRODUCT.NOTADDPRO');
    this.TRY = trnaslateService.instant('MODPRODUCT.TRY');
    this.TITLE_ = trnaslateService.instant('MODPRODUCT.TITLE_');
    this.SUBTITLE_ = trnaslateService.instant('MODPRODUCT.SUBTITLE_');
    this.UPDATEPRO = trnaslateService.instant('MODPRODUCT.UPDATEPRO');
    this.ok = trnaslateService.instant('BOTTONS.OK');
    
    this.servicoID = this.navParams.get("servicioID");
    this.pedidoID = this.navParams.get("pedidoID");
    console.log("IDS: ", this.servicoID, this.pedidoID);
    this.menu.enable(true); // Enable sidemenu
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalProductPage");
  }

  /**
   * Do any initialization
   */
  ngOnInit() {
    this.formValidation();
    this.nota = "";
    this._nota = "";

    this.idx = this.navParams.get("producto");

    if (this.idx != undefined) {
      this.cargarProducto(this.idx);
    }
  }

  /***
   * --------------------------------------------------------------
   * Form Validation
   * --------------------------------------------------------------
   * @method   formValidation
   */
  formValidation() {
    this.myForm = this.formBuilder.group({
      nota: ["", Validators.compose([])],
      _nota: ["", Validators.compose([Validators.required])]
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  increment() {
    this.currentNumber++;
  }

  decrement() {
    if (this.currentNumber > 0) {
      this.currentNumber--;
    }
  }

  agregar_producto(cantidad, nota, _nota) {
    console.log(cantidad, nota);
    let prodAdd = this.trnaslateService.instant('MODPRODUCT.ADDPRO');
    let toast = this.toastCtrl.create({
      message: prodAdd,
      duration: 2000,
      position: "long"
    });

    let producto = {
      cantidad: cantidad,
      nota: nota,
      _nota: _nota
    };

    let pedidoID = localStorage.getItem("pedidoID");
    let servicioID = localStorage.getItem("servicioID");
    this.providerServ
      .saveServiceProductPQ(producto, pedidoID, servicioID)
      .then((exixte: any) => {
        localStorage.setItem("producto", "true");
        this.navCtrl.pop();
      })
      .catch(err => {
        this.alertCtrl
          .create({
            title: this.NOTADDPRO,
            subTitle: this.TRY,
            buttons: [this.ok]
          })
          .present();
      });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  agregar_producto_serv(cantidad, nota, _nota) {
    console.log(cantidad, nota);
    let prodAdd = this.trnaslateService.instant('MODPRODUCT.ADDPRO');
    let toast = this.toastCtrl.create({
      message: prodAdd,
      duration: 2000,
      position: "long"
    });

    let producto = {
      cantidad: cantidad,
      nota: nota,
      _nota: _nota
    };

    let pedidoID = this.pedidoID;
    let servicioID = this.servicoID;
    this.providerServ
      .saveServiceProductPQ(producto, pedidoID, servicioID)
      .then((exixte: any) => {
        localStorage.setItem("producto", "true");
        const pedidoN = localStorage.getItem("pedidoN");
        if (pedidoN == "nuevo") {
          this.navCtrl.pop();
        } else {
          this.navCtrl.pop();
        }
      })
      .catch(err => {
        this.alertCtrl
          .create({
            title: this.NOTADDPRO,
            subTitle: this.TRY,
            buttons: [this.ok]
          })
          .present();
      });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  cargarProducto(idx) {
    console.log(idx);
    this.providerServ.getProducto(idx).then(producto => {
      this.producto = producto;
      console.log(this.producto);
      this.currentNumber = this.producto.cantidad;
      this._nota = this.producto.producto;
      this.nota = this.producto.descripcion;
    });
  }

  modificar_producto(cantidad, nota, _nota, idx) {
    let toast = this.toastCtrl.create({
      message: this.UPDATEPRO,
      duration: 2000,
      position: "long"
    });

    this.providerServ
      .updateProducto(cantidad, nota, _nota, idx)
      .then((exixte: any) => {
        this.navCtrl.pop();
      })
      .catch(err => {
        this.alertCtrl
          .create({
            title: this.TITLE_,
            subTitle: this.SUBTITLE_,
            buttons: [this.ok]
          })
          .present();
      });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  modificar_producto_serv(cantidad, nota, _nota, idx) {
    let toast = this.toastCtrl.create({
      message: this.UPDATEPRO,
      duration: 2000,
      position: "long"
    });

    this.providerServ
      .updateProducto(cantidad, nota, _nota, idx)
      .then((exixte: any) => {
        const pedidoN = localStorage.getItem("pedidoN");
        if (pedidoN == "nuevo") {
          this.navCtrl.pop();
        } else {
          this.navCtrl.pop();
        }
      })
      .catch(err => {
        this.alertCtrl
          .create({
            title: this.TITLE_,
            subTitle: this.SUBTITLE_,
            buttons: [this.ok]
          })
          .present();
      });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
}
