import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from "../../service/user.service";
import {PayProvider} from "../../providers/pay/pay";
import {Alipay, AlipayOrder} from "@ionic-native/alipay";

@IonicPage()
@Component({
    selector: 'page-confirm-order',
    templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {
    userInfo: Object = {};
    errorMessage: any;
    orders: any = [];
    sum: number = 0;
    payway: number = 0;
    alipayOrder: AlipayOrder = {
        app_id: '2018040302498148',
        method: 'alipay.trade.app.pay',
        format: 'JSON',
        // return_url: 'https://www.baidu.com',
        charset: 'utf-8',
        sign_type: 'RSA2',
        sign: '',
        timestamp: '',
        version: '1.0',
        notify_url: '',
        biz_content: ''
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage: Storage,
                public userService: UserService,
                public payProvider: PayProvider,
                private alipay: Alipay) {
        this.orders = JSON.parse(this.navParams.get('products'));

        let p = 0;
        for (let i = 0; i < this.orders.length; i++) {
            p += this.orders[i].orderNum * this.orders[i].price;
        }
        this.sum = p;
    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.userService.httpGetUser(val).subscribe(
                    userInfo => {
                        this.userInfo = userInfo['data'];
                    },
                    error => this.errorMessage = <any>error
                )
            }
        });
    }

    confirmPay() {
        if (this.payway == 0) {
            // 支付宝
            this.alipay.pay(this.alipayOrder)
                .then(result => {
                    console.log(result); // Success
                })
                .catch(error => {
                    console.log(error); // Failed
                });
        } else if (this.payway == 1) {
            // 微信
        }
    }
}
