import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodItemDetailsPage } from './food-item-details';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FoodItemDetailsPage,
  ],
  imports: [
    TranslateModule, IonicPageModule.forChild(FoodItemDetailsPage),
  ],
})
export class FoodItemDetailsPageModule { }
