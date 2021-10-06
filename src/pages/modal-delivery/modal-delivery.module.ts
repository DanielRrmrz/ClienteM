import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDeliveryPage } from './modal-delivery';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalDeliveryPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ModalDeliveryPage),
  ],
})
export class ModalDeliveryPageModule {}
