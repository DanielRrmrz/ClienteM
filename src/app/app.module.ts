import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { MyApp } from "./app.component";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Geolocation } from "@ionic-native/geolocation";
import { RegisterUserProvider } from "../providers/register-user/register-user";
import { IonicStorageModule } from "@ionic/storage";
import { NativeStorage } from "@ionic-native/native-storage";
import { Keyboard } from "@ionic-native/keyboard";
import { AndroidFullScreen } from "@ionic-native/android-full-screen";
import { Stripe } from "@ionic-native/stripe";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { HttpModule } from "@angular/http";
import { StarRatingModule } from "ionic3-star-rating";
import { OneSignal } from "@ionic-native/onesignal";
import { SMS } from "@ionic-native/sms";
import { CallNumber } from "@ionic-native/call-number";
import { AppVersion } from "@ionic-native/app-version";
import { Market } from "@ionic-native/market";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { EmailComposer } from "@ionic-native/email-composer";

import { AgmCoreModule } from "@agm/core"; // @agm/core
import { AgmDirectionModule } from "agm-direction"; // agm-direction

//Redes Sociales
import { Facebook } from "@ionic-native/facebook";
// import { GooglePlus } from "@ionic-native/google-plus";

// By default TranslateLoader will look for translation json files in i18n/
// So change this lool in the src/assets directory.
export function TranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

//firebase
import { AngularFireModule } from "@angular/fire";
import {
  AngularFirestoreModule,
  FirestoreSettingsToken,
} from "@angular/fire/firestore";
import {
  AngularFireDatabaseModule,
  AngularFireDatabase,
} from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import { UbicacionProvider } from "../providers/ubicacion/ubicacion";
import { RestaurantesProvider } from "../providers/restaurantes/restaurantes";
import { ServicesProvider } from "../providers/services/services";
import { CardProvider } from "../providers/card/card";
import { HomePageModule } from "../pages/home/home.module";
import { ContactPageModule } from "../pages/contact/contact.module";
import { MapPageModule } from "../pages/map/map.module";
import { ModalProductPageModule } from "../pages/modal-product/modal-product.module";
import { FirstLandingPageModule } from "../pages/first-landing/first-landing.module";
import { ServicePageModule } from "./../pages/service/service.module";
import { PushProvider } from "../providers/push/push";
import { SettingsProvider } from "../providers/settings/settings";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { ChatServiceProvider } from "../providers/chat-service/chat-service";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { ModalVersionAppPageModule } from "../pages/modal-version-app/modal-version-app.module";
import { TerminosPageModule } from '../pages/terminos/terminos.module';
import { PrivacidadPageModule } from '../pages/privacidad/privacidad.module';

//Conexión
const firebaseConfig = {
    apiKey: "AIzaSyCBWTmCjb-1_zDsl-yjBwl3EqCnVA_SEto",
    authDomain: "toctoc-54179.firebaseapp.com",
    databaseURL: "https://toctoc-54179.firebaseio.com",
    projectId: "toctoc-54179",
    storageBucket: "toctoc-54179.appspot.com",
    messagingSenderId: "134453154716",
    appId: "1:134453154716:web:26965999c2d8fd821eee59",
    measurementId: "G-SN55VRL2WJ"
};

firebase.initializeApp(firebaseConfig);
// const firestore = firebase.firestore();
// firestore.settings({ timestampsInSnapshots: true });

@NgModule({
  declarations: [MyApp],
  imports: [
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    AgmCoreModule.forRoot({
      // @agm/core
      language: "es",
      apiKey: "AIzaSyCBWTmCjb-1_zDsl-yjBwl3EqCnVA_SEto",
    }),
    AgmDirectionModule, // agm-direction
    HomePageModule,
    MapPageModule,
    ModalProductPageModule,
    ModalVersionAppPageModule,
    ContactPageModule,
    FirstLandingPageModule,
    ServicePageModule,
    TerminosPageModule,
    PrivacidadPageModule,
    IonicModule.forRoot(MyApp, {
      menuType: "overlay",
      platforms: {
        ios: {
          backButtonText: "",
        },
      },
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot(),
    HttpModule,
    StarRatingModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    RegisterUserProvider,
    AngularFireDatabase,
    Facebook,
    // GooglePlus,
    UbicacionProvider,
    RestaurantesProvider,
    ServicesProvider,
    NativeStorage,
    Keyboard,
    AndroidFullScreen,
    Stripe,
    ScreenOrientation,
    OneSignal,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: FirestoreSettingsToken, useValue: {} },
    CardProvider,
    PushProvider,
    SettingsProvider,
    SMS,
    CallNumber,
    AndroidPermissions,
    ChatServiceProvider,
    NativeStorage,
    LocationAccuracy,
    AppVersion,
    Market,
    InAppBrowser,
    EmailComposer,
  ],
})
export class AppModule {}
