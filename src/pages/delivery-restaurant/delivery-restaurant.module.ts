import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryRestaurantPage } from './delivery-restaurant';
import { TranslateModule } from "@ngx-translate/core";
import { AgmCoreModule } from "@agm/core";
import { AgmDirectionModule } from "agm-direction"; 
@NgModule({
  declarations: [DeliveryRestaurantPage],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(DeliveryRestaurantPage),
    AgmCoreModule,
    AgmDirectionModule
  ]
})
export class DeliveryRestaurantPageModule {}
