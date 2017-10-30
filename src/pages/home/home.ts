import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AppGlobal, AppService} from '../../app/app.service';
import {ProductsPage} from "../products/products";
import {LoginPage} from "../login/login";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public banners;
    public products;

    constructor(public navCtrl: NavController, public appService: AppService) {
        this.getBanners();
        this.getProduct();
    }

    getBanners() {
        this.appService.httpGet(AppGlobal.API.getBanner, '', d => {
            if (d.code == 0) {
                this.banners = d.data;
            }
        })
    }

    getProduct() {
        this.appService.httpGet(AppGlobal.API.getProducts, '', d => {
            if (d.code == 0) {
                this.products = d.data;
            }
        })
    }

    goProduct() {
        this.navCtrl.push(ProductsPage);
    }

    goToLogin() {
        this.navCtrl.push(LoginPage)
    }

}
