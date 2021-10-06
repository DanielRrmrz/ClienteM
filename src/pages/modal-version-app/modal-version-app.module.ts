import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalVersionAppPage } from './modal-version-app';

@NgModule({
  declarations: [
    ModalVersionAppPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalVersionAppPage),
  ],
})
export class ModalVersionAppPageModule {}
