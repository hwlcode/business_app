import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup} from "@angular/forms";
import {numberValidator, phoneValidator} from "../../app/validator";
import {Storage} from '@ionic/storage';
import {AppGlobal, AppService} from "../../app/app.service";

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    public loginForm: FormGroup;

    constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public appService: AppService) {
        let fb = new FormBuilder();
        this.loginForm = fb.group({
            phone: ['', [phoneValidator]],
            phoneCode: ['', [numberValidator]]
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    login() {
        if (this.loginForm.valid) {
            console.log(this.loginForm.value);
            this.storage.set('isLogin', true);
        }
    }

    // 验证码倒计时
    verifyCode: any = {
        verifyCodeTips: "获取验证码",
        countdown: 60,
        disable: true
    }

    // 倒计时
    settime() {
        if (this.verifyCode.countdown == 1) {
            this.verifyCode.countdown = 60;
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
        this.appService.httpGet(AppGlobal.API.verifyCode, {
            phone: this.loginForm.value.phone
        }, d => {
            if (d.code == 0) {

            }
        })
        //此处实现验证码请求
        this.verifyCode.disable = false;
        this.settime();
    }
}
