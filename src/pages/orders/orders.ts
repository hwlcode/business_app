import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {
    public isLogin: boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage: Storage) {
        this.storage.get('isLogin').then(result => {
            if (result) {
                this.isLogin = true;
            }
        })
    }

    goToLogin() {
        this.navCtrl.push(LoginPage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrdersPage');
    }

    ionViewWillEnter() {
        // this.storage.get('isLogin').then(result => {
        //     console.log(result);
        //     if(!result){
        //         this.navCtrl.push(LoginPage);
        //     }
        // });
    }

}
