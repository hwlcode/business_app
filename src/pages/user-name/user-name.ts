import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {Storage} from "@ionic/storage";
import {BaseUI} from "../../common/baseui";

@IonicPage()
@Component({
    selector: 'page-user-name',
    templateUrl: 'user-name.html',
})
export class UserNamePage extends BaseUI{
    fromGroup: FormGroup;
    name: string = '';

    constructor(private navPramas: NavParams,
                private storage: Storage,
                private viewCtrl: ViewController,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private userService: UserService) {
        super();

        let fb = new FormBuilder();
        this.fromGroup = fb.group({
            name: ['', Validators.required]
        });

        this.name = this.navPramas.get('user').name;
    }

    update() {
        if (this.fromGroup.valid) {
            this.storage.get('user').then(id => {
                if (id != null) {
                    this.fromGroup.value.id = id;
                    let loading = super.showLoading(this.loadingCtrl, '保存中...');
                    this.userService.httpPostName(this.fromGroup.value).subscribe(data => {
                        if (data.code === 0) {
                            loading.dismiss();
                            super.showToast(this.toastCtrl, '更改成功。');
                            this.viewCtrl.dismiss();
                        }
                    });
                }
            });
        }
    }
}
