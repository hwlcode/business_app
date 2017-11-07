import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../app/app.service";
import {Storage} from '@ionic/storage';
import {ProfilePage} from "../profile/profile";

@IonicPage()
@Component({
    selector: 'page-user-name',
    templateUrl: 'user-name.html',
})
export class UserNamePage {
    public fromGroup: FormGroup;
    public phone: string;

    constructor(public navCtrl: NavController,
                public appService: AppService,
                public storage: Storage,
                public navParams: NavParams) {
        let fb = new FormBuilder();
        this.fromGroup = fb.group({
            name: ['', Validators.required]
        });

        this.storage.get('isLogin').then(result => {
            if (result) {
                this.phone = result;
            }
        })
    }

    update() {
        if (this.fromGroup.valid) {
            this.fromGroup.value.phone = this.phone;
            this.appService.httpPost('/api/saveProfile', this.fromGroup.value, (res) => {
                if (res.code === 0) {
                    this.navCtrl.setRoot(ProfilePage);
                }
            })
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UserNamePage');
    }

}
