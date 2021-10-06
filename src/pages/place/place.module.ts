import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacePage } from './place';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PlacePage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(PlacePage),
  ],
})
export class PlacePageModule {}
