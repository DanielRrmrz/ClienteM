import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodCategoryItemsPage } from './food-category-items';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FoodCategoryItemsPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(FoodCategoryItemsPage),
  ],
})
export class FoodCategoryItemsPageModule { }
