import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-check-orders',
    templateUrl: 'check-orders.html',
})
export class CheckOrdersPage {
    public orders: any[];
    public products: any;
    public num: number = 0;
    public sum: number = 0;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public events: Events,
                public viewCtrl: ViewController) {
        this.orders = this.navParams.get('productList');
        this.num = this.navParams.get('num');
        this.sum = this.navParams.get('sum');
    }

    dismiss() {
        let data = {
            show: false,
            orders: this.orders,
            num: this.num,
            sum: this.sum
        };
        this.viewCtrl.dismiss(data);
    }

    removeProduct(product) {
        if (this.num > 0) {
            this.num--;
        }
        let order = new Order(product, 1);
        this.sum -= parseInt((order.product as any).price, 10);
        let isExist = JSON.stringify(this.orders).indexOf((order.product as any)._id);
        if (isExist) {
            this.orders.map(item => {
                if (item.product._id == (order.product as any)._id) {
                    if (item.num > 1) {
                        item.num--;
                    } else if (item.num == 1) {
                        this.orders.splice(item, 1);
                    }
                }
            });
        }
        this.events.publish('product:add', this.num, this.sum);
    }

    addProduct(product) {
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

        this.events.publish('product:remove', this.num, this.sum);
    }

    // ionViewDidLoad() {
    //     console.log('ionViewDidLoad CheckOrdersPage');
    // }

}

class Order {
    constructor(public product: object,
                public num: number) {

    }
}

