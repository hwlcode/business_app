import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {UtilService} from "../../service/util.service";
import {LoginPage} from "../login/login";

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {
    isLogin: boolean = false;

    constructor(private utilService: UtilService, private navCtrl: NavController) {

        this.utilService.getLoginStatus().then(data => {
            if (data) {
                this.isLogin = true;
            }
        });

    }

    goToLogin() {
        this.navCtrl.push(LoginPage);
    }
}
