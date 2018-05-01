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
        this.orders = navParams.get('productList');
        this.num = navParams.get('num');
        this.sum = navParams.get('sum');
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
        if(product.orderNum > 0){
            product.orderNum--;
        }

        let n = 0, p = 0;
        for(let i = 0; i < this.orders.length; i++){
            n += this.orders[i].orderNum;
            p += this.orders[i].orderNum * this.orders[i].price;
        }
        this.num = n;
        this.sum = p;
    }

    addProduct(product) {
        product.orderNum++;

        let n = 0, p = 0;
        for(let i = 0; i < this.orders.length; i++){
            n += this.orders[i].orderNum;
            p += this.orders[i].orderNum * this.orders[i].price;
        }
        this.num = n;
        this.sum = p;
    }
}

