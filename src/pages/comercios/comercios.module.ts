import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComerciosPage } from './comercios';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ComerciosPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ComerciosPage),
  ],
})
export class ComerciosPageModule {}
