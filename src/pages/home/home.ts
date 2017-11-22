import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {ProductsPage} from "../products/products";
import {LoginPage} from "../login/login";
import {ShoppingPage} from "../shopping/shopping";
import {BannerService} from "../../service/banner.service";
import {ProductService} from "../../service/product.service";
import {CoreService} from "../../service/core.service";
import {UtilService} from "../../service/util.service";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    public banners;
    public products;

    constructor(private navCtrl: NavController,
                private bannerService: BannerService,
                private coreService: CoreService,
                private utilService: UtilService,
                private productService: ProductService) {

    }

    ngOnInit() {
        this.getBanners();
        this.getProduct();
    }

    user() {
        this.navCtrl.push(LoginPage);
    }

    getItems(event) {
        this.navCtrl.push(ProductsPage, {word: event.data});
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
        this.productService.httpGetProduct().subscribe(data => {
            if (data.code == 0) {
                this.products = data.data;
                this.products.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                })
            }
        });
    }

    goProduct() {
        this.utilService.getLoginStatus().then(data => {
            if(data){
                this.navCtrl.push(ProductsPage);
            }else{
                this.navCtrl.push(LoginPage);
            }
        })
    }

    goToOrder() {
        this.navCtrl.parent.select(1);
    }

    goToShopping() {
        this.navCtrl.push(ShoppingPage);
    }

    goToUser() {
        this.navCtrl.parent.select(2);
    }

}
