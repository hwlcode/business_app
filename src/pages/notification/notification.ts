import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-notification',
    templateUrl: 'notification.html',
})
export class NotificationPage {
    items: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.items = [
            {title: '我们己经成功收到您的订单，会尽快为您发货！', date: '2018-1-15'},
            {title: '我们己经成功收到您的订单，会尽快为您发货！', date: '2018-1-14'},
            {title: '我们己经成功收到您的订单，会尽快为您发货！', date: '2018-1-13'},
            {title: '我们己经成功收到您的订单，会尽快为您发货！', date: '2018-1-12'},
            {title: '我们己经成功收到您的订单，会尽快为您发货！', date: '2018-1-11'},
            {title: '我们己经成功收到您的订单，会尽快为您发货！', date: '2018-1-10'}
        ];
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationPage');
    }

    removeItem(item){
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] == item){
                this.items.splice(i, 1);
            }
        }
    }

}
