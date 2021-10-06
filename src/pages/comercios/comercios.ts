import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: "page-comercios",
  templateUrl: "comercios.html"
})
export class ComerciosPage {
  categorias: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public _providerSettings: SettingsProvider
  ) {
    this.menu.enable(false); // Enable sidemenu
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ComerciosPage");
    this.getCategorias();
  }

  goBack() {
    this.navCtrl.setRoot("HomePage", [], {
      
      animation: "md-transition",
      animate: true,
      direction: "down"
    });
  }

  getCategorias() {
    this._providerSettings.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
      console.log("Categorias: ", this.categorias);
    });
  }

  goToFoodCategoris(key){
    this.navCtrl.setRoot(
      "FoodCategoriesPage",
      { uidCategoria: key },
      {
        duration: 2000,
        animation: "md-transition",
        animate: true,
        direction: "up"
      }
    );
  }

}
