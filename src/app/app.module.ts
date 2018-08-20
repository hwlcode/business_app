import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpModule} from "@angular/http";
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
import {ImageService} from "../service/image.service";
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {FileTransfer} from "@ionic-native/file-transfer";
import {DatePicker} from "@ionic-native/date-picker";
import {UserNamePage} from "../pages/user-name/user-name";
import {UserNamePageModule} from "../pages/user-name/user-name.module";
import {ShoppingPage} from "../pages/shopping/shopping";
import {ShoppingPageModule} from "../pages/shopping/shopping.module";
import {CheckOrdersPageModule} from "../pages/check-orders/check-orders.module";
import {CheckOrdersPage} from "../pages/check-orders/check-orders";
import {UtilService} from "../service/util.service";
import {CoreService} from "../service/core.service";
import {UserService} from "../service/user.service";
import {BannerService} from "../service/banner.service";
import {ProductService} from "../service/product.service";
import {UserAddressPageModule} from "../pages/user-address/user-address.module";
import {UserAddressPage} from "../pages/user-address/user-address";
import {SearchPageModule} from "../pages/search/search.module";
import {SearchPage} from "../pages/search/search";
import {PipesModule} from "../pipes/pipes.module";
import {OrderService} from "../service/order.service";
import {NotificationService} from "../service/notification.service";
import {AppVersion} from "@ionic-native/app-version";
import {VersionPageModule} from "../pages/version/version.module";
import {VersionPage} from "../pages/version/version";
import {ConfirmOrderPage} from "../pages/confirm-order/confirm-order";
import {ConfirmOrderPageModule} from "../pages/confirm-order/confirm-order.module";
import {PayProvider} from '../providers/pay/pay';
import {Alipay} from "@ionic-native/alipay";
import {CodeDetailPage} from "../pages/code-detail/code-detail";
import {CodeDetailPageModule} from "../pages/code-detail/code-detail.module";
import {AboutPage} from "../pages/about/about";
import {AboutPageModule} from "../pages/about/about.module";
import {WechatChenyu} from "wechat-chenyu";
import {UpdateService} from "../service/update.service";
import {FileOpener} from "@ionic-native/file-opener";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {File} from '@ionic-native/file';
import {Diagnostic} from "@ionic-native/diagnostic";

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
        CheckOrdersPageModule,
        UserAddressPageModule,
        SearchPageModule,
        VersionPageModule,
        AboutPageModule,
        PipesModule,
        CodeDetailPageModule,
        ConfirmOrderPageModule,
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
        VersionPage,
        ShoppingPage,
        UserAddressPage,
        CheckOrdersPage,
        SearchPage,
        ConfirmOrderPage,
        CodeDetailPage,
        AboutPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        ImageService,
        Camera,
        File,
        FileOpener,
        InAppBrowser,
        ImagePicker,
        FileTransfer,
        AppVersion,
        DatePicker,
        UtilService,
        CoreService,
        UserService,
        BannerService,
        ProductService,
        OrderService,
        NotificationService,
        UpdateService,
        Diagnostic,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        PayProvider,
        WechatChenyu,
        Alipay
    ]
})
export class AppModule {
}
