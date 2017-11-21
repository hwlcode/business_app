import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup} from "@angular/forms";
import {numberValidator, phoneValidator} from "../../app/validator";
import {Storage} from '@ionic/storage';
import {AppGlobal, AppService} from "../../app/app.service";
import {UtilService} from "../../service/util.service";
import {ProfilePage} from "../profile/profile";
import {UserService} from "../../service/user.service";

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    loginForm: FormGroup;
    // 验证码倒计时
    verifyCode: any = {
        verifyCodeTips: "获取验证码",
        countdown: 30,
        disable: true
    }

    constructor(private navCtrl: NavController,
                private storage: Storage,
                private utilService: UtilService,
                private viewCtrl: ViewController,
                private userService: UserService,
                private appService: AppService) {
        let fb = new FormBuilder();
        this.loginForm = fb.group({
            phone: ['15868823605', [phoneValidator]],
            phoneCode: ['', [numberValidator]]
        })
    }

    login() {
        if (this.loginForm.valid) {
            this.userService.httpPost(this.loginForm.value).subscribe(data => {
                if (data.code == 0) {
                    this.storage.set('user', data.data.doc);

                    this.navCtrl.push(ProfilePage, {phone: data.data.doc.phone}).then(() => {
                        let index = this.viewCtrl.index;
                        this.navCtrl.remove(index);
                    });
                    this.utilService.toast('登录成功');
                }else{
                    this.appService.toast(data.msg);
                }
            });
        }
    }

    // 倒计时
    settime() {
        if (this.verifyCode.countdown == 1) {
            this.verifyCode.countdown = 30;
            this.verifyCode.verifyCodeTips = "获取验证码";
            this.verifyCode.disable = true;
            return;
        } else {
            this.verifyCode.countdown--;
        }

        this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
        setTimeout(() => {
            this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
            this.settime();
        }, 1000);
    }

    getCode() {
        if (this.loginForm.value.phone == '') {
            console.debug("请填写手机号!");
            return;
        }

        //发送验证码成功后开始倒计时
        if(this.verifyCode.disable) {
            this.appService.httpGet(AppGlobal.API.verifyCode, {
                phone: this.loginForm.value.phone
            }, d => {
                this.appService.alert(d);
                if (d.code == 'OK') {
                    console.log(d);
                } else {
                    this.appService.toast(d.msg);
                }
            })
        }
        this.verifyCode.disable = false;
        this.settime();
    }

    ionViewCanEnter() {
        this.utilService.getLoginStatus().then(data => {
            if (data) {
                this.navCtrl.push(ProfilePage).then(() => {
                    let index = this.viewCtrl.index;
                    this.navCtrl.remove(index);
                });
            }
        })
    }
}
