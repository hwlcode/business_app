import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {CheckOrdersPage} from "../check-orders/check-orders";
import {CoreService} from "../../service/core.service";
import {ProductService} from "../../service/product.service";
import {Storage} from '@ionic/storage';
import {ProfilePage} from "../profile/profile";
import {ConfirmOrderPage} from "../confirm-order/confirm-order";

@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    products: any;
    keywords: string;
    userId: string;

    show: boolean = false;
    orders: any = [];

    num: number = 0;
    sum: number = 0;

    noLogin: boolean = true;
    logined: boolean = false;

    constructor(private modalCtrl: ModalController,
                private coreService: CoreService,
                private navCtrl: NavController,
                private viewCtrl: ViewController,
                private storage: Storage,
                private productService: ProductService) {

        this.getProduct();
    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.noLogin = false;
                this.logined = true;

                this.userId = val;
            }
        });
    }

    getProduct() {
        this.productService.httpGetProductAll().subscribe(data => {
            if (data.code == 0) {
                this.products = data.data;
                this.products.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                    item.orderNum = 0;
                })
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    goToLogin() {
        this.navCtrl.push(ProfilePage);
    }

    presentModal() {
        if (!this.show) {
            const modal = this.modalCtrl.create(CheckOrdersPage, {
                productList: this.orders,
                num: this.num,
                sum: this.sum
            }, {
                showBackdrop: true
            });
            modal.onDidDismiss(data => {
                this.show = data.show;
                this.orders = data.orders;
                this.num = data.num;
                this.sum = data.sum;
            });
            modal.present();

            this.show = true;
        }
    }

    chooseProduct(product) {
        let order = new Order(product, 1);
        let isExist = JSON.stringify(this.orders).indexOf((order.product as any)._id) != -1;

        if (!isExist) {
            this.orders.push(product);
        }

        let n = 0, p = 0;
        for (let i = 0; i < this.orders.length; i++) {
            n += this.orders[i].orderNum;
            p += this.orders[i].orderNum * this.orders[i].price;
        }
        this.num = n;
        this.sum = p;
    }

    selectPayWay() {
        this.navCtrl.push(ConfirmOrderPage, {products: JSON.stringify(this.orders)});
        // let actionSheet = this.actionSheetCtrl.create({
        //     title: '选择支付方式',
        //     buttons: [
        //         {
        //             text: '微信支付',
        //             handler: () => {
        //                 this.weChatPay();
        //             }
        //         }, {
        //             text: '支付宝支付',
        //             handler: () => {
        //                 this.aliPay();
        //             }
        //         }, {
        //             text: '取消',
        //             role: 'cancel',
        //             handler: () => {
        //                 console.log('cancel');
        //             }
        //         }
        //     ]
        // });
        // actionSheet.present();
    }

    // private weChatPay() {
    //     this.postOrder();
    // }
    //
    // private aliPay() {
    //     this.postOrder();
    // }
    //
    // paySuccess() {
    //     this.utilService.alert('支付成功，我们会尽快为您发货。', () => {
    //         this.navCtrl.push(OrdersPage);
    //     });
    // }
    //
    // postOrder() {
    //     if(this.orders.length > 0) {
    //         this.orderService.httpPostOrder({
    //             products: JSON.stringify(this.orders),
    //             sumPrice: this.sum,
    //             customer: this.userId
    //         }).subscribe(res => {
    //             if (res.code == 0) {
    //                 this.paySuccess();
    //             }
    //         });
    //     }
    // }

    /**
     * 搜索
     */
    getItems() {
        this.productService.httpProductFilter({
            keywords: this.keywords,
            page: 1
        }).subscribe(data => {
            if (data.code == 0) {
                this.products = data.data;
                this.products.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                })
            }
        });
    }
}

class Order {
    constructor(public product: object,
                public num: number) {

    }
}
