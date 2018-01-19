import {Component} from '@angular/core';
import {IonicPage, NavController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {NotificationService} from "../../service/notification.service";

@IonicPage()
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    tab1Root = 'HomePage';
    tab2Root = 'ShoppingPage';
    tab3Root = 'NotificationPage';
    tab4Root = 'ProfilePage';
    notificationNum: number;
    userId: string;

    constructor(public navCtrl: NavController,
                public storage: Storage,
                public notificationService: NotificationService) {

    }

    ionViewDidLoad() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.userId = val;
                this.getNotification();
            }
        });
    }

    getNotification() {
        this.notificationService.unReadUserNotification(this.userId)
            .subscribe(res => {
                if(res.code === 0){
                    if(res.data.length > 0){
                        this.notificationNum = res.data.length;
                    }
                }
            })
    }
}
