import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicePage } from './service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ServicePage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ServicePage),
  ],
})
export class ServicePageModule {}
