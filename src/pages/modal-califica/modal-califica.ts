import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-modal-califica",
  templateUrl: "modal-califica.html"
})
export class ModalCalificaPage {
  serviceID: any;
  rating: number;
  disable: any;
  comentario: any = "hiden";
  comment: any = '';
  _comment: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public menu: MenuController,
    public translateService: TranslateService,
    public _providerServ: ServicesProvider
  ) {
    this._comment = translateService.instant('MODALSCORE.COMMENT');
    this.menu.enable(false); // Enable sidemenu
    this.serviceID = this.navParams.get("serviceID");
    console.log("Este es mi servicio califica", this.serviceID);

    events.subscribe("star-rating:changed", starRating => {
      console.log(starRating);
      this.rating = starRating;
    });

    if (this.rating == null) {
      this.disable = true;
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalCalificaPage");
  }

  Rating(rating) {
    console.log("Calificación", rating);

    if (rating > 0) {
      this.disable = false;
    }

    if (rating < 4) {
      this.comentario = "show";
      console.log("Comentario : ", this.comentario);
    } else {
      this.comentario = "hiden";
      console.log("Comentario : ", this.comentario);
    }
  }

  saveRating(rating) {
    console.log("Calificación", rating);
    const comentario = this.comment;
    this._providerServ
      .updateCalificacion(this.serviceID, rating, comentario)
      .then(() => {
        localStorage.removeItem("califica");
        localStorage.removeItem("servicioID");
        this.navCtrl.setRoot("HomePage");
      });
  }
}
