import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AppGlobal, AppService} from '../../app/app.service';
import {ProductsPage} from "../products/products";
import {LoginPage} from "../login/login";
import {Storage} from '@ionic/storage';
import {ShoppingPage} from "../shopping/shopping";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit{
    public banners;
    public products;
    public isLogin: boolean = false;
    public avatar: string;

    constructor(
        public navCtrl: NavController,
        public appService: AppService,
        public storage: Storage,
    ) {
        this.storage.get('isLogin').then(result => {
            if (result) {
                this.isLogin = true;
                (async() => {
                    await this.appService.httpGet(AppGlobal.API.profile, {
                        phone: result
                    }, (data) => {
                        if (data.code == 0) {
                            let user = data.data;
                            this.avatar = AppGlobal.domain + user.avatar.path;
                        }
                    });
                })();
            }
        })
    }

    ngOnInit() {
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
        this.appService.httpGet(AppGlobal.API.getProducts, '', d => {
            if (d.code == 0) {
                this.products = d.data;
                this.products.map(item => {
                    item.image = AppGlobal.domain + item.banner.path;
                })
            }
        })
    }

    goProduct() {
        if(!this.isLogin){
            return this.goToLogin()
        }
        this.navCtrl.push(ProductsPage);
    }

    goToLogin() {
        this.navCtrl.push(LoginPage)
    }

    goToOrder() {
        if(!this.isLogin){
            this.goToLogin()
        }

        this.navCtrl.parent.select(1);
    }

    goToShopping() {
        this.navCtrl.push(ShoppingPage);
    }

    goToUser() {
        if(!this.isLogin){
            this.goToLogin()
        }

        this.navCtrl.parent.select(2);
    }

}
