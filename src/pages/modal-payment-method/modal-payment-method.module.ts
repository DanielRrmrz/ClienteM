import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPaymentMethodPage } from './modal-payment-method';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalPaymentMethodPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ModalPaymentMethodPage),
  ],
})
export class ModalPaymentMethodPageModule {}
