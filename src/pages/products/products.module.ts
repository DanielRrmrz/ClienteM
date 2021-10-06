import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsPage } from './products';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProductsPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ProductsPage),
  ],
})
export class ProductsPageModule {}
