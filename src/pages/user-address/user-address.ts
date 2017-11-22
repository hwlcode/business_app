import {Component, OnInit} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {UtilService} from "../../service/util.service";
import {ProfilePage} from "../profile/profile";

@IonicPage()
@Component({
    selector: 'page-user-address',
    templateUrl: 'user-address.html',
})
export class UserAddressPage implements OnInit{
    fromGroup: FormGroup;
    phone: string;
    address: string;
    user: any;

    constructor(public navCtrl: NavController,
                public userService: UserService,
                public utilService: UtilService,
                public events: Events,
                public navParams: NavParams) {

        let fb = new FormBuilder();
        this.fromGroup = fb.group({
            address: ['', Validators.required]
        });

        this.utilService.getLoginStatus().then(data => {
            if (data) {
                this.phone = data.phone;
                this.user = data;
                this.address = data.address;
            }
        });

        //只有数据发生变化时才可以接收到, 用于同步数据时用。
        this.events.subscribe('user:message', user => {
            this.user = user;
        });
    }

    ngOnInit() {

    }

    update() {
        if (this.fromGroup.valid) {
            this.fromGroup.value.phone = this.phone;

            this.userService.httpPostAddress(this.fromGroup.value).subscribe(data => {
                if (data.code === 0) {
                    this.navCtrl.setRoot(ProfilePage);
                }
            });
        }
    }

}
