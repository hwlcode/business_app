import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {CheckOrdersPage} from "../check-orders/check-orders";
import {ActionSheetController} from 'ionic-angular';
import {BannerService} from "../../service/banner.service";
import {CoreService} from "../../service/core.service";
import {ProductService} from "../../service/product.service";
import {Storage} from '@ionic/storage';
import {ProfilePage} from "../profile/profile";

@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    banners: any;
    products: any;
    keywords: string;

    show: boolean = false;
    orders: any = [];

    num: number = 0;
    sum: number = 0;

    noLogin: boolean = true;
    logined: boolean = false;

    constructor(private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController,
                private bannerService: BannerService,
                private coreService: CoreService,
                private navCtrl: NavController,
                private viewCtrl: ViewController,
                private storage: Storage,
                private productService: ProductService) {

        this.getBanners();
        this.getProduct();
    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.noLogin = false;
                this.logined = true;
            }
        });
    }

    getBanners() {
        this.bannerService.httpGetBanner().subscribe(data => {
            if (data.code == 0) {
                this.banners = data.data;
                this.banners.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                })
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

    goToLogin(){
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

    removeProduct(product) {
        if(this.num == 0){
            return false;
        }
        if (this.num > 0) {
            this.num--;
        }
        let order = new Order(product, 1);
        this.sum -= parseInt((order.product as any).price, 10);
        let isExist = JSON.stringify(this.orders).indexOf((order.product as any)._id);
        if (isExist) {
            this.orders.map(item => {
                if (item.product._id == (order.product as any)._id) {
                    if (item.num > 0) {
                        item.num--;
                    } else if (item.num == 1) {
                        this.orders.splice(item, 1);
                    }
                }
            });
        }
    }

    addProduct(product, $event) {
        this.num++;
        let order = new Order(product, 1);
        let isExist = JSON.stringify(this.orders).indexOf((order.product as any)._id);
        this.sum += parseInt((order.product as any).price, 10);
        if (isExist < 0) {
            this.orders.push(order);
        } else {
            this.orders.map(item => {
                if (item.product._id == (order.product as any)._id) {
                    item.num++;
                }
            });
        }
    }

    selectPayWay() {
        let actionSheet = this.actionSheetCtrl.create({
            title: '选择支付方式',
            buttons: [
                {
                    text: '微信支付',
                    handler: () => {
                        console.log('微信支付');
                    }
                }, {
                    text: '支付宝支付',
                    handler: () => {
                        console.log('支付宝支付');
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('cancel');
                    }
                }
            ]
        });
        actionSheet.present();
    }

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
