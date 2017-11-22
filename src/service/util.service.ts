import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {ToastController} from "ionic-angular";

@Injectable()
export class UtilService {

    constructor(public storage: Storage, public toastCtrl: ToastController) {
    }

    getTabs(): Array<{ key: string, value: string, icon: string, page: string }> {
        return [{
            key: 'home',
            value: '首页',
            icon: 'home',
            page: 'HomePage'
        },
            {
                key: 'cart',
                value: '订单',
                icon: 'cart',
                page: 'OrdersPage'
            },
            {
                key: 'contact',
                value: '我的',
                icon: 'contact',
                page: 'ProfilePage'
            }]
    }

    getLoginStatus() {
        return this.storage.get('user').then((val) => {
            return val;
        })
    }

    getFirstIn() {
        return this.storage.get('firstIn').then((val) => {
            return val;
        })
    }

    toast(message, callback?) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 5000,
            dismissOnPageChange: true,
        });
        toast.present();
        if (callback) {
            callback();
        }
    }

    // getHtmlText(str: string) {
    //     return str.replace(/<[^>]+>/g, '');
    // }
}
