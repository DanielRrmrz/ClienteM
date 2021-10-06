import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModificarCarritoPage } from './modificar-carrito';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModificarCarritoPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ModificarCarritoPage),
  ],
})
export class ModificarCarritoPageModule {}
