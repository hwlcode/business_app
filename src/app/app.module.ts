import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpModule} from "@angular/http";
import {AppService} from "./app.service";
import {IonicStorageModule} from "@ionic/storage";
import {WelcomePage} from "../pages/welcome/welcome";
import {WelcomePageModule} from "../pages/welcome/welcome.module";
import {TabsPageModule} from "../pages/tabs/tabs.module";
import {TabsPage} from "../pages/tabs/tabs";
import {ProductsPage} from "../pages/products/products";
import {ProductsPageModule} from "../pages/products/products.module";
import {LoginPage} from "../pages/login/login";
import {LoginPageModule} from "../pages/login/login.module";
import {OrdersPage} from "../pages/orders/orders";
import {OrdersPageModule} from "../pages/orders/orders.module";
import {ProfilePage} from "../pages/profile/profile";
import {ProfilePageModule} from "../pages/profile/profile.module";
import {ImageService} from "./image.service";
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {FileTransfer} from "@ionic-native/file-transfer";
import {DatePicker} from "@ionic-native/date-picker";
import {UserNamePage} from "../pages/user-name/user-name";
import {UserNamePageModule} from "../pages/user-name/user-name.module";
import {ShoppingPage} from "../pages/shopping/shopping";
import {ShoppingPageModule} from "../pages/shopping/shopping.module";

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        HttpModule,
        WelcomePageModule,
        TabsPageModule,
        ProductsPageModule,
        LoginPageModule,
        OrdersPageModule,
        ProfilePageModule,
        UserNamePageModule,
        ShoppingPageModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(MyApp, {
            backButtonText: '返回',              //重置back文案
            tabsHideOnSubPages: 'true',         //隐藏全部子页面tabs
            mode: 'ios'                         //把所有平台设置为iOS风格
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        WelcomePage,
        TabsPage,
        ProductsPage,
        LoginPage,
        OrdersPage,
        ProfilePage,
        UserNamePage,
        ShoppingPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AppService,
        ImageService,
        Camera,
        ImagePicker,
        FileTransfer,
        DatePicker,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
