import {Component} from '@angular/core';
import {IonicPage, NavController} from "ionic-angular";
import {UtilService} from "../../service/util.service";
import {LoginPage} from "../login/login";

@IonicPage()
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage{
    tabs: Array<{ key: string, value: string, icon: string, page: string }>;

    constructor(public utilService: UtilService,
                public navCtrl: NavController) {
        this.getTabs();
    }

    getTabs() {
        this.tabs = this.utilService.getTabs();
    }

    selectedTab(event) {
        if(event.index == 1 || event.index == 2){
            this.utilService.getLoginStatus().then( data => {
                console.log(data);
                if(data == null){
                    this.navCtrl.push(LoginPage);
                }
            })
        }
    }
}
