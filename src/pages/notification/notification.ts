import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationService} from "../../service/notification.service";
import {Storage} from '@ionic/storage';
import {ProfilePage} from "../profile/profile";

@IonicPage()
@Component({
    selector: 'page-notification',
    templateUrl: 'notification.html',
})
export class NotificationPage {
    items: any;
    userId: string;

    noLogin: boolean = true;
    logined: boolean = false;

    constructor(public navCtrl: NavController,
                public notificationService: NotificationService,
                public storage: Storage,
                public navParams: NavParams) {
    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.userId = val;

                this.noLogin = false;
                this.logined = true;

                this.getNotification();
            }
        });
    }

    getNotification() {
        this.notificationService.getUserNotificationList(this.userId).subscribe(res => {
            if (res.code === 0) {
                this.items = res.data;
            }
        });
    }

    removeItem(item) {
        this.notificationService.delUserNotification(item._id)
            .subscribe(res => {
                if (res.code === 0) {
                    for (let i = 0; i < this.items.length; i++) {
                        if (this.items[i] == item) {
                            this.items.splice(i, 1);
                        }
                    }
                }
            });
    }

    readItem(item) {
        this.notificationService.readUserNotification(item._id)
            .subscribe(res => {
                if (res.code === 0) {
                    item.read = 1;
                }
            });
    }

    goToLogin() {
        this.navCtrl.push(ProfilePage);
    }

    doRefresh(refresher) {
        this.notificationService.getUserNotificationList(this.userId).subscribe(res => {
            if (res.code === 0) {
                this.items = res.data;
                refresher.complete();
            }
        });
    }

}
