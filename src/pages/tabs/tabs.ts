import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = 'HomePage';
    tab2Root = 'OrdersPage';
    tab3Root = 'ProfilePage';

    constructor(public storage: Storage) {
        this.storage.get('isLogin').then(result => {
            if (result) {
                console.log(result);
            }
        })
    }

}
