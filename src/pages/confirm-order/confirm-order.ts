import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from "../../service/user.service";
import {PayProvider} from "../../providers/pay/pay";
// import { Alipay, AlipayOrder } from '@ionic-native/alipay';
import {UtilService} from "../../service/util.service";
import {OrderService} from "../../service/order.service";
import {OrdersPage} from "../orders/orders";
import {NotificationService} from "../../service/notification.service";
import {Http} from "@angular/http";
// import {OrdersPage} from "../orders/orders";

declare let cordova: any;  // 合局引入cordova，只需在index.html先引入，需在真机里才可以调试 https://stackoverflow.com/questions/31368026/cordova-plugin-file-in-chrome-cordova-is-not-defined

@IonicPage()
@Component({
    selector: 'page-confirm-order',
    templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {
    userInfo: Object = {};
    address: string;
    name: string;
    phone: string;

    errorMessage: any;
    orders: any = [];
    sum: number = 0;
    payway: number = 0;
    payInfo: string;
    subject: string = '';
    body: string = '';
    sn: string;
    userId: string;
    tradeId: string;
    adminId: string;
    hasPay: boolean = false;
    no: string;
    adminPhone: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage: Storage,
                public userService: UserService,
                public payProvider: PayProvider,
                public http: Http,
                // private alipay: Alipay,
                public userSerive: UserService,
                public orderService: OrderService,
                public notificationService: NotificationService,
                public utilService: UtilService) {
        this.orders = JSON.parse(this.navParams.get('products'));
        this.sn = this.navParams.get('sn');
        this.no = this.navParams.get('orderNo');

        let p = 0;
        for (let i = 0; i < this.orders.length; i++) {
            p += this.orders[i].orderNum * this.orders[i].price;
            this.subject += this.orders[i].name + ' ';
            this.body += this.orders[i].name + 'x' + this.orders[i].orderNum + ' ';
        }
        this.sum = p;
    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.userId = val;
                this.userService.httpGetUser(val).subscribe(
                    userInfo => {
                        this.userInfo = userInfo['data'];
                        this.address = userInfo['data']['address'];
                        this.name = userInfo['data']['name'];
                        this.phone = userInfo['data']['phone'];
                    },
                    error => this.errorMessage = <any>error
                )
            }
        });

        this.userSerive.httpGetAdminId().subscribe(
            res => {
                if(res.code == 0){
                    this.adminId = res.data._id;
                    this.adminPhone = res.data.phone;
                }
            }
        );

        // 获取支付宝签名字符串
        this.payProvider.postPayInfo({
            subject: this.subject,
            body: this.body,
            outTradeId: this.sn,
            amount: this.sum + ''
        }).subscribe(res => {
            if (res) {
                this.payInfo = res.data.msg;
            }
        })
    }

    confirmPay() {
        var self = this;

        if (this.payway == 0) {
            // 支付宝
            cordova.plugins.alipay.payment(this.payInfo,
                function success(e) {
                    //e.resultStatus  状态代码  e.result  本次操作返回的结果数据 e.memo 提示信息
                    //e.resultStatus  9000  订单支付成功 ;8000 正在处理中  调用function success
                    //e.resultStatus  4000  订单支付失败 ;6001  用户中途取消 ;6002 网络连接出错  调用function error
                    //当e.resultStatus为9000时，请去服务端验证支付结果
                    /**
                     * 同步返回的结果必须放置到服务端进行验证（验证的规则请看https://doc.open.alipay.com/doc2/
                     * detail.htm?spm=0.0.0.0.xdvAU6&treeId=59&articleId=103665&
                     * docType=1) 建议商户依赖异步通知
                     */
                    if(e.resultStatus == 9000){
                        // let res = JSON.parse(e.result);
                        // self.tradeId = res.alipay_trade_app_pay_response.trade_no;
                        // //验证订单
                        // self.payProvider.queryOrder(self.sn, self.tradeId).subscribe(res => {
                        //     self.utilService.alert(res.data.ok);
                        //     if (res.data.ok) {
                        //
                        //     }
                        // });

                        // 通知商家发货
                        let opts = {
                            content: '您收到新的订单：' + self.no + ' 请尽快处理！',
                            from: self.userId,
                            to: self.adminId // 管理员ID
                        }
                        self.userOrderNotification(opts);
                        self.msgToBusiness(self.adminPhone, self.no);

                        // 用户收到下单通知
                        let businessOpts = {
                            content: '您的订单：' + self.no + ' 己经生成，我们会尽快为您发货！非常感谢您的订购，祝生活愉快！电话咨询：18078660058',
                            from: self.adminId, // 管理员ID
                            to: self.userId
                        }
                        self.userOrderNotification(businessOpts);

                        // 改变订单状态 status=1
                        self.changeOrderStatus();
                        // 禁用按钮
                        self.hasPay = true;
                    }
                }, function error(e) {
                    self.utilService.toast(e.memo);
                    self.navCtrl.push(OrdersPage);
                    self.hasPay = true;
                });
        } else if (this.payway == 1) {
            // 微信
        }
    }

    changeOrderStatus(){
        this.orderService.httpUpdateOrderById(this.sn).subscribe(
            res => {
                if(res.code == 0){
                    this.navCtrl.push(OrdersPage);
                }
            }
        )
    }

    userOrderNotification(opts){
        this.notificationService.createNotification(opts).subscribe(
            res => {
                if(res.code == 0){

                }
            }
        )
    }

    // 短信通知商家发货
    msgToBusiness(phone, sn) {
        this.notificationService.msgToBusiness(phone, sn).subscribe(
            data => {

            }
        )
    }
}
