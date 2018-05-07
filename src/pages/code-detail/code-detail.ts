import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from "../../service/user.service";
import {Http} from "@angular/http";
import {UtilService} from "../../service/util.service";
import {OrderService} from "../../service/order.service";
import {NotificationService} from "../../service/notification.service";

@IonicPage()
@Component({
    selector: 'page-code-detail',
    templateUrl: 'code-detail.html',
})
export class CodeDetailPage implements OnInit {
    userInfo: Object = {};
    userId: string;
    errorMessage: any;
    product: any;
    orderNum: number = 1;
    sumCode: number = 0;
    userCode: number = 0;
    isHidden: boolean = true;
    adminId: string;
    adminPhone: string;

    constructor(public navCtrl: NavController,
                public storage: Storage,
                public userService: UserService,
                public http: Http,
                public utilService: UtilService,
                public orderService: OrderService,
                public userSerive: UserService,
                public notificationService: NotificationService,
                public navParams: NavParams) {
        this.product = navParams.get('product');
        this.sumCode = this.orderNum * this.product.code;
    }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.userId = val;
                this.userService.httpGetUser(val).subscribe(
                    userInfo => {
                        this.userInfo = userInfo['data'];

                        this.userCode = userInfo['data']['code'];

                        if (this.userCode < this.sumCode) {
                            this.isHidden = false;
                        } else {
                            this.isHidden = true;
                        }
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
    }

    chooseProduct(product) {
        if (this.orderNum < 1) {
            this.orderNum = 1;
        }
        this.sumCode = this.orderNum * product.code;
        if (this.userCode < this.sumCode) {
            this.isHidden = false;
        } else {
            this.isHidden = true;
        }
    }

    commitOrder() {
        this.product.orderNum = this.orderNum;
        this.orderService.httpPostCode({
            id: this.userId,
            product: this.product
        }).subscribe(
            json => {
                if(json.code == 0){
                    // 通知商家发货
                    let opts = {
                        content: '您收到新的订单：' + json.data.sn + ' 请尽快处理！',
                        from: this.userId,
                        to: this.adminId // 管理员ID
                    }
                    this.userOrderNotification(opts);
                    this.msgToBusiness(this.adminPhone, json.data.sn);

                    this.utilService.alert('兑换商品成功，我们将尽快为您发货！', () => {
                        this.navCtrl.pop();
                    });
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
