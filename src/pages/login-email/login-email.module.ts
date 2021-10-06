import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginEmailPage } from './login-email';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LoginEmailPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(LoginEmailPage),
  ],
})
export class LoginEmailPageModule {}
