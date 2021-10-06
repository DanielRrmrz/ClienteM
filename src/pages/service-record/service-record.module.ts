import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceRecordPage } from './service-record';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ServiceRecordPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ServiceRecordPage),
  ],
})
export class ServiceRecordPageModule {}
