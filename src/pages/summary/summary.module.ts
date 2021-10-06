import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SummaryPage } from './summary';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SummaryPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(SummaryPage),
  ],
})
export class SummaryPageModule {}
