import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProductService} from "../../service/product.service";
import {CoreService} from "../../service/core.service";

@IonicPage()
@Component({
    selector: 'page-shopping',
    templateUrl: 'shopping.html',
})
export class ShoppingPage {
    products: any;

    constructor(public navCtrl: NavController,
                public productService: ProductService,
                public coreService: CoreService,
                public navParams: NavParams) {
    }

    ionViewDidEnter() {
        this.getProduct('', 1);
    }

    getProduct(keywords, page) {
        this.productService.httpProductFilter({
            keywords: keywords,
            page: page
        }).subscribe(data => {
            if (data.code == 0) {
                this.products = data.data;
                this.products.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                });
            }
        });
    }

}
