import {Component} from '@angular/core';
import {Events, IonicPage, NavParams} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {CheckOrdersPage} from "../check-orders/check-orders";
import {ActionSheetController} from 'ionic-angular';
import {BannerService} from "../../service/banner.service";
import {CoreService} from "../../service/core.service";
import {ProductService} from "../../service/product.service";

@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    banners: any;
    products: any;
    num: number = 0;
    sum: number = 0;
    show: boolean = false;
    keywords: string;
    orders: any = [];

    constructor(private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController,
                private bannerService: BannerService,
                private coreService: CoreService,
                private events: Events,
                private navPramas: NavParams,
                // private viewCtl: ViewController,
                private productService: ProductService) {

        this.getBanners();
        this.getProduct();

        this.events.subscribe('product:add', (num, sum) => {
            this.num = num;
            this.sum = sum;
        });

        this.events.subscribe('product:remove', (num, sum) => {
            this.num = num;
            this.sum = sum;
        })

        this.keywords = this.navPramas.get('word');

        console.log(this.products);
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
                    console.log()
                })
            }
        });
    }

    presentModal() {
        if (!this.show) {
            const modal = this.modalCtrl.create(CheckOrdersPage, {
                productList: this.orders,
                num: this.num,
                sum: this.sum
            },{
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

    // public removeProduct(product) {
    //     if (this.num > 0) {
    //         this.num--;
    //     }
    //     let order = new Order(product, 1);
    //     this.sum -= parseInt((order.product as any).price, 10);
    //     let isExist = JSON.stringify(this.orders).indexOf((order.product as any)._id);
    //     if (isExist) {
    //         this.orders.map(item => {
    //             if (item.product._id == (order.product as any)._id) {
    //                 if (item.num > 1) {
    //                     item.num--;
    //                 } else if (item.num == 1) {
    //                     this.orders.splice(item, 1);
    //                 }
    //             }
    //         });
    //     }
    // }
    //
    // public addProduct(product, $event) {
    //     this.num++;
    //     let order = new Order(product, 1);
    //     let isExist = JSON.stringify(this.orders).indexOf((order.product as any)._id);
    //     this.sum += parseInt((order.product as any).price, 10);
    //     if (isExist < 0) {
    //         this.orders.push(order);
    //     } else {
    //         this.orders.map(item => {
    //             if (item.product._id == (order.product as any)._id) {
    //                 item.num++;
    //             }
    //         });
    //     }
    // }

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
            keywords: this.keywords
        }).subscribe( data => {
            if (data.code == 0) {
                this.products = data.data;
                this.products.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                })
            }
        });
    }
}

// class Order {
//     constructor(public product: object,
//                 public num: number) {
//
//     }
// }
