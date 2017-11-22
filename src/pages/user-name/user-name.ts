import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfilePage} from "../profile/profile";
import {UserService} from "../../service/user.service";
import {UtilService} from "../../service/util.service";

@IonicPage()
@Component({
    selector: 'page-user-name',
    templateUrl: 'user-name.html',
})
export class UserNamePage {
    fromGroup: FormGroup;
    phone: string;
    name: string;

    constructor(private navCtrl: NavController,
                private utilService: UtilService,
                private userService: UserService) {

        let fb = new FormBuilder();
        this.fromGroup = fb.group({
            name: ['', Validators.required]
        });

        this.utilService.getLoginStatus().then(data => {
            if (data) {
                this.phone = data.phone;
                this.name = data.name;
            }
        });
    }

    update() {
        if (this.fromGroup.valid) {
            this.fromGroup.value.phone = this.phone;

            this.userService.httpPostName(this.fromGroup.value).subscribe(data => {
                if (data.code === 0) {
                    this.navCtrl.setRoot(ProfilePage);
                }
            });
        }
    }
}
