import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilPage } from './perfil';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PerfilPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(PerfilPage),
  ],
})
export class PerfilPageModule {}
