import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-welcome',
    templateUrl: 'welcome.html',
})
export class WelcomePage {
    slides = [
        {
            title: "现代农业智慧农村",
            description: "广西盈垦现代",
            img: "assets/welcome.jpeg"
        }
    ];
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    goToHome() {
        this.navCtrl.setRoot(TabsPage);
    }

}
