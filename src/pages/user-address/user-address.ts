import {Component, OnInit} from '@angular/core';
import {
    Events, IonicPage, LoadingController, NavController, NavParams, ToastController,
    ViewController
} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {Storage} from "@ionic/storage";
import {BaseUI} from "../../common/baseui";

@IonicPage()
@Component({
    selector: 'page-user-address',
    templateUrl: 'user-address.html',
})
export class UserAddressPage extends BaseUI implements OnInit {
    fromGroup: FormGroup;
    address: string;
    user: any;

    constructor(public navCtrl: NavController,
                public userService: UserService,
                public events: Events,
                public storage: Storage,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public viewCtrl: ViewController,
                public navParams: NavParams) {
        super();

        let fb = new FormBuilder();
        this.fromGroup = fb.group({
            address: ['', Validators.required]
        });

        this.address = this.navParams.get('user').address;
    }

    ngOnInit() {

    }

    update() {
        let loading = super.showLoading(this.loadingCtrl, '保存中...');
        if (this.fromGroup.valid) {
            this.storage.get('user').then(id => {
                if (id != null) {
                    this.fromGroup.value.id = id;
                    this.userService.httpPostAddress(this.fromGroup.value).subscribe(data => {
                        if (data.code === 0) {
                            this.viewCtrl.dismiss();
                            loading.dismiss();
                            super.showToast(this.toastCtrl, '更新成功。');
                        }
                    });
                }
            })
        }
    }

}
