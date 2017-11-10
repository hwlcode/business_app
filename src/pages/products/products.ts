import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AppGlobal, AppService} from "../../app/app.service";
import {ModalController} from 'ionic-angular';
import {CheckOrdersPage} from "../check-orders/check-orders";
import { ActionSheetController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    public banners: any;
    public products: any;
    public num: number = 0;
    public sum: number = 0;
    private show: boolean = false;
    private orders: any = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public viewCtrl: ViewController,
                public actionSheetCtrl: ActionSheetController,
                public appService: AppService) {
        this.getBanners();
        this.getProduct();
    }

    getBanners() {
        this.appService.httpGet(AppGlobal.API.getBanner, '', d => {
            if (d.code == 0) {
                this.banners = d.data;
                this.banners.map(item => {
                    item.image = AppGlobal.domain + item.banner.path;
                })
            }
        })
    }

    getProduct() {
        this.appService.httpGet(AppGlobal.API.products, '', d => {
            if (d.code == 0) {
                this.products = d.data;
                this.products.map(item => {
                    item.image = AppGlobal.domain + item.banner.path;
                })
            }
        })
    }

    presentModal() {
        if (!this.show) {
            const modal = this.modalCtrl.create(CheckOrdersPage, {
                productList: this.orders,
                num: this.num,
                sum: this.sum
            });
            modal.onDidDismiss(data => {
                console.log(data);
                this.show = data.show;
                this.orders = data.orders;
                this.num = data.num;
                this.sum = data.sum;
            });
            modal.present();

            this.show = true;
        }
    }

    public removeProduct(product) {
        if (this.num > 0) {
            this.num--;
        }
        let order = new Order(product, 1);
        this.sum -= parseInt(order.product.price, 10);
        let isExist = JSON.stringify(this.orders).indexOf(order.product._id);
        if (isExist) {
            this.orders.map(item => {
                if (item.product._id == order.product._id) {
                    if (item.num > 1) {
                        item.num--;
                    } else if (item.num == 1) {
                        this.orders.splice(item, 1);
                    }
                }
            });
        }
    }

    public addProduct(product) {
        this.num++;
        let order = new Order(product, 1);
        let isExist = JSON.stringify(this.orders).indexOf(order.product._id);
        this.sum += parseInt(order.product.price, 10);
        if (isExist < 0) {
            this.orders.push(order);
        } else {
            this.orders.map(item => {
                if (item.product._id == order.product._id) {
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
                },{
                    text: '支付宝支付',
                    handler: () => {
                        console.log('支付宝支付');
                    }
                },{
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

    hideTabs() {
        //当页面进入初始化的时候隐藏tabs
        let elements = document.querySelectorAll(".tabbar");
        if (elements != null) {
            Object.keys(elements).map((key) => {
                elements[key].style.display = 'none';
            });
        }
    }

    showTabs() {
        //当退出页面的时候,显示tabs
        let elements = document.querySelectorAll(".tabbar");
        if (elements != null) {
            Object.keys(elements).map((key) => {
                elements[key].style.display = 'flex';
            });
        }
    }


    ionViewWillLeave() {

    }
}

class Order {
    constructor(public product: object,
                public num: number) {

    }
}
