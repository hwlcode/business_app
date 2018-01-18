import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {UtilService} from "../../service/util.service";
import {LoginPage} from "../login/login";
import {Storage} from '@ionic/storage';
import {OrderService} from "../../service/order.service";

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {
    isLogin: boolean = false;
    userId: string;
    orders: any;

    constructor(private utilService: UtilService,
                private storage: Storage,
                private orderService: OrderService,
                private navCtrl: NavController) {

        this.utilService.getLoginStatus().then(data => {
            if (data) {
                this.isLogin = true;
            }
        });
    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.userId = val;
                this.getOrderList();
            }
        });
    }

    getOrderList() {
        this.orderService.httpGetOrderById(this.userId).subscribe(res => {
            if(res.code == 0){
                this.orders = res.orders;
                this.orders.map( order => {
                    order.products = JSON.parse(order.products);
                });
            }
        });
    }

    goToLogin() {
        this.navCtrl.push(LoginPage);
    }
}
