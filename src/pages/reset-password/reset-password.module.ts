import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetPasswordPage } from './reset-password';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ResetPasswordPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ResetPasswordPage),
  ],
})
export class ResetPasswordPageModule {}
