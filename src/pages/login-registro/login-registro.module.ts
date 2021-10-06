import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginRegistroPage } from './login-registro';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LoginRegistroPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginRegistroPage),
    TranslateModule
  ],
})
export class LoginRegistroPageModule {}
