import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  AlertController,
  LoadingController
} from "ionic-angular";
import firebase from "firebase/app";
import { RegisterUserProvider } from "../../providers/register-user/register-user";

@IonicPage()
@Component({
  selector: "page-login-phone",
  templateUrl: "login-phone.html"
})
export class LoginPhonePage {
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  public phoneNumber: any;
  public phoneDisable: boolean = true;
  public loading: any;
  public _phone: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public alertCtrl: AlertController,
    public loadinCtrl: LoadingController,
    public _providerUser: RegisterUserProvider
  ) {
    this.menu.enable(false); // Disable sidemenu
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPhonePage");
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    this._phone = this.navParams.get("phoneNumber");
    if (this._phone != null) {
      this.phoneNumber = this._phone;
      this.phoneDisable = false;
    }
  }

  phone_Disable() {
    const phone = String(this.phoneNumber);
    console.log(phone.length);

    if (phone.length == 10) {
      this.phoneDisable = false;
    } else if (phone.length != 10) {
      this.phoneDisable = true;
    }
  }

  signIn(phoneNumber: number) {
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + 52 + phoneNumber;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        let prompt = this.alertCtrl.create({
          title: "Ingresa tu código de confirmación",
          inputs: [
            { name: "confirmationCode", placeholder: "Código de confirmación" }
          ],
          buttons: [
            {
              text: "Cancelar",
              handler: data => {
                console.log("Cancel clicked");
                this.navCtrl.pop();
              }
            },
            {
              text: "Enviar",
              handler: data => {
                confirmationResult
                  .confirm(data.confirmationCode)
                  .then(result => {
                    // User signed in successfully.
                    this.autenticando();
                    console.log(result.user);
                    const user = result.user;
                    this._providerUser
                      .registerWithPhone(user)
                      .then((res: any) => {
                        localStorage.setItem("isLogin", "true");
                        localStorage.setItem("uid", res.uid);
                        localStorage.removeItem("anonimo");

                        this.navCtrl.setRoot("UserInformationPage", {
                          tipo: "phone"
                        });
                        setTimeout(() => {
                          this.loading.dismiss();
                        }, 1000);
                      })
                      .catch(err => {
                        console.log(err);

                        this.alertCtrl
                          .create({
                            title: "Error al acceder",
                            subTitle: "Intente de nuevo por favor",
                            buttons: ["Aceptar"]
                          })
                          .present();
                        setTimeout(() => {
                          this.loading.dismiss();
                        }, 1000);
                      });
                    // ...
                  })
                  .catch(error => {
                    // User couldn't sign in (bad verification code?)
                    // ...
                    console.log("Error: ", error);
                    this.alertCtrl
                      .create({
                        title: "Error al acceder",
                        subTitle:
                          "Código de verificación incorrecto, intente de nuevo por favor",
                        buttons: [
                          {
                            text: "Aceptar",
                            handler: () => {
                              this.navCtrl.setRoot(
                                "LoginPage",
                                {
                                  tipo: "phone",
                                  phoneNumber: phoneNumber
                                }
                              );
                            }
                          }
                        ]
                      })
                      .present();
                  });
              }
            }
          ]
        });
        prompt.present();
      })
      .catch(function(error) {
        console.error("SMS not sent", error);
      });
  }

  autenticando() {
    this.loading = this.loadinCtrl.create({
      spinner: "bubbles",
      content: "Autenticando"
    });

    this.loading.present();
  }

  goBack() {
    this.navCtrl.setRoot("FirstLandingPage");
  }
}
