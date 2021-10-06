import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPhonePage } from './login-phone';

@NgModule({
  declarations: [
    LoginPhonePage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPhonePage),
  ],
})
export class LoginPhonePageModule {}
