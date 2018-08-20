import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {WelcomePage} from '../pages/welcome/welcome';
import {Storage} from '@ionic/storage';
import {TabsPage} from "../pages/tabs/tabs";
import {UtilService} from "../service/util.service";
import {UpdateService} from "../service/update.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'TabsPage';

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                private utilService: UtilService,
                private updateService: UpdateService,
                private storage: Storage) {

        this.utilService.getFirstIn().then(data => {
            if (data) {
                this.rootPage = TabsPage;
            }
            else {
                this.storage.set('firstIn', true);
                this.rootPage = WelcomePage;
            }
        });
        this.utilService.alloyLeverInit(); // 本地"开发者工具"

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // 重点：在平台准备好后再加载插件，否则会报错
            statusBar.styleDefault();
            splashScreen.hide();
            this.updateService.checkVersion(); // 版本升级检测
        });
    }
}
