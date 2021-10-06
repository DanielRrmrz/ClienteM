import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ModalCalificaPage } from "./modal-califica";
import { StarRatingModule } from "ionic3-star-rating";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ModalCalificaPage],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ModalCalificaPage), StarRatingModule],
})
export class ModalCalificaPageModule {}
