import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppGlobal, AppService} from "../../app/app.service";

@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    public banners;
    public products;

    constructor(public navCtrl: NavController, public navParams: NavParams, public appService: AppService) {
        this.getBanners();
        this.getProduct();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProductsPage');
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
