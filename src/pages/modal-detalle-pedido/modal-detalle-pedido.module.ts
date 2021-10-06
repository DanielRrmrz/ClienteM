import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDetallePedidoPage } from './modal-detalle-pedido';

@NgModule({
  declarations: [
    ModalDetallePedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDetallePedidoPage),
  ],
})
export class ModalDetallePedidoPageModule {}
