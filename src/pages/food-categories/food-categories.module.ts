import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodCategoriesPage } from './food-categories';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FoodCategoriesPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(FoodCategoriesPage),
  ],
})
export class FoodCategoriesPageModule { }
