import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {ProductsPage} from "../products/products";
import {ShoppingPage} from "../shopping/shopping";
import {BannerService} from "../../service/banner.service";
import {ProductService} from "../../service/product.service";
import {CoreService} from "../../service/core.service";
import {ProfilePage} from "../profile/profile";

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
                private modalCtrl: ModalController,
                private productService: ProductService) {

    }

    ngOnInit() {
        this.getBanners();
        this.getProduct();
    }

    user() {
        this.navCtrl.push(ProfilePage);
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
        var modal = this.modalCtrl.create(ProductsPage);
        modal.present();
    }

    goToShopping() {
        this.navCtrl.parent.select(1);
    }
}
