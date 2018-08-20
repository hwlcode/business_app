import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProductService} from "../../service/product.service";
import {CoreService} from "../../service/core.service";
import {Storage} from '@ionic/storage';
import {CodeDetailPage} from "../code-detail/code-detail";

@IonicPage()
@Component({
    selector: 'page-shopping',
    templateUrl: 'shopping.html',
})
export class ShoppingPage {
    products: any;
    last: boolean = false;
    infiniteScroll: any;
    logined: boolean = false;

    constructor(public navCtrl: NavController,
                public productService: ProductService,
                public coreService: CoreService,
                public storage: Storage,
                public navParams: NavParams) {
    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val !== null) {
                this.logined = true;
            }
        });
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

    doRefresh(refresher) {
        this.productService.httpProductFilter({
            keywords: '',
            page: 1
        }).subscribe(data => {
            if (data.code == 0) {
                this.products = data.data;
                this.products.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                });
            }
            refresher.complete();
        });
    }

    doInfinite(infiniteScroll) {
        let page = 1;
        page++;
        this.infiniteScroll = infiniteScroll;
        this.productService.httpProductFilter({
            keywords: '',
            page: page
        }).subscribe(data => {
            if (data.code == 0) {
                this.last = data.isLast;
                this.products = this.products.concat(data.data);
                this.products.concat(data.data);
                this.products.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                });

                infiniteScroll.complete();

                if (this.last) {
                    infiniteScroll.enable(false);
                }
            }
        });
    }

    shoppingByCode(product) {
        this.navCtrl.push(CodeDetailPage, {product: product});
    }

}
