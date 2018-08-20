import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {ProductsPage} from "../products/products";
// import {BannerService} from "../../service/banner.service";
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
    public keywords: string;
    public last: boolean = false;
    public infiniteScroll: any;

    constructor(private navCtrl: NavController,
                // private bannerService: BannerService,
                private coreService: CoreService,
                private modalCtrl: ModalController,
                private productService: ProductService) {

    }

    ngOnInit() {
        // this.getBanners();
        this.getProduct('', 1);
    }

    user() {
        this.navCtrl.push(ProfilePage);
    }

    getItems(event) {
        this.getProduct(this.keywords || '', 1);
    }

    doRefresh(refresher) {
        this.productService.httpProductFilter({
            keywords: '',
            page: 1
        }).subscribe(data => {
            if (data.code == 0) {
                this.products = data.data;
                if(this.infiniteScroll){
                    this.infiniteScroll.enable(true);
                }
                this.products.map(item => {
                    item.image = this.coreService.domain + item.banner.path;
                });
                refresher.complete();
            }
        });
    }

    doInfinite(infiniteScroll) {
        let page = 1;
        page++;
        this.infiniteScroll = infiniteScroll;
        this.productService.httpProductFilter({
            keywords: this.keywords || '',
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

    // getBanners() {
    //     this.bannerService.httpGetBanner().subscribe(data => {
    //         if (data.code == 0) {
    //             this.banners = data.data;
    //             this.banners.map(item => {
    //                 item.image = this.coreService.domain + item.banner.path;
    //             })
    //         }
    //     });
    // }

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

    goProduct() {
        var modal = this.modalCtrl.create(ProductsPage);
        modal.present();
    }

    goToShopping() {
        this.navCtrl.parent.select(1);
    }
}
