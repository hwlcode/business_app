import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage"

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
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
