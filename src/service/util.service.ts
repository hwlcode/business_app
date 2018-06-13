import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AlertController, ToastController} from "ionic-angular";

@Injectable()
export class UtilService {

    constructor(public storage: Storage,
                public toastCtrl: ToastController,
                private alertCtrl: AlertController) {
    }

    getTabs(): Array<{ key: string, value: string, icon: string, page: string }> {
        return [
            {
                key: 'home',
                value: '首页',
                icon: 'home',
                page: 'HomePage'
            },
            {
                key: 'shopping',
                value: '积分商城',
                icon: 'basket',
                page: 'ShoppingPage'
            },
            {
                key: 'notifications',
                value: '通知',
                icon: 'notifications',
                page: 'NotificationPage'
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

    alert(message, callback?) {
        if (callback) {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: [
                    {
                        text: '取消',
                        handler: data => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: "确定",
                        handler: data => {
                            callback();
                        }
                    }]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: ["确定"]
            });
            alert.present();
        }
    }

    // getHtmlText(str: string) {
    //     return str.replace(/<[^>]+>/g, '');
    // }
}
