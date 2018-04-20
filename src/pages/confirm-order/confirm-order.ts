import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from "../../service/user.service";
import {PayProvider} from "../../providers/pay/pay";
// import { Alipay, AlipayOrder } from '@ionic-native/alipay';
import {UtilService} from "../../service/util.service";
declare let cordova: any;  // 合局引入cordova，只需在index.html先引入，需在真机里才可以调试 https://stackoverflow.com/questions/31368026/cordova-plugin-file-in-chrome-cordova-is-not-defined

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
    payInfo: string;
    subject: string = '';
    body: string = '';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage: Storage,
                public userService: UserService,
                public payProvider: PayProvider,
                // private alipay: Alipay,
                public util: UtilService) {
        this.orders = JSON.parse(this.navParams.get('products'));

        let p = 0;
        for (let i = 0; i < this.orders.length; i++) {
            p += this.orders[i].orderNum * this.orders[i].price;
            this.subject += this.orders[i].name + ' ';
            this.body += this.orders[i].name + 'x' +this.orders[i].orderNum + ' ';
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

        // 获取支付宝签名字符串
        console.log(this.subject);
        console.log(this.body);
        this.payProvider.postPayInfo({
            subject: this.subject,
            body: this.body,
            amount: this.sum + ''
        }).subscribe(res => {
            if(res){
                this.payInfo = res.data.msg;
            }
        })
    }

    confirmPay() {
        if (this.payway == 0) {
            // 支付宝
            cordova.plugins.alipay.payment(this.payInfo,function success(e){
                this.util.alert(e);
            },function error(e){
                this.util.alert(e);
            });
        } else if (this.payway == 1) {
            // 微信
        }
    }
}
