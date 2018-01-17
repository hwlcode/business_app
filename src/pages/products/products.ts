import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {CheckOrdersPage} from "../check-orders/check-orders";
import {ActionSheetController} from 'ionic-angular';
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

    chooseProduct(product) {
        let order = new Order(product, 1);
        let isExist = JSON.stringify(this.orders).indexOf((order.product as any)._id) != -1;

        if(!isExist){
            this.orders.push(product);
        }

        let n = 0, p = 0;
        for(let i = 0; i < this.orders.length; i++){
            n += this.orders[i].orderNum;
            p += this.orders[i].orderNum * this.orders[i].price;
        }
        this.num = n;
        this.sum = p;
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
