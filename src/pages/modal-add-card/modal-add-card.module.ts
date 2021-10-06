import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddCardPage } from './modal-add-card';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalAddCardPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ModalAddCardPage),
  ],
})
export class ModalAddCardPageModule {}
