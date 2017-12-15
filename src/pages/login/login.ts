import {Component} from '@angular/core';
import {IonicPage, LoadingController, ToastController, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup} from "@angular/forms";
import {numberValidator, phoneValidator} from "../../app/validator";
import {Storage} from '@ionic/storage';
import {UtilService} from "../../service/util.service";
import {UserService} from "../../service/user.service";
import {BaseUI} from "../../common/baseui";
import md5 from 'blueimp-md5';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage extends BaseUI {
    loginForm: FormGroup;
    showMessage: any;
    // 验证码倒计时
    verifyCode: any = {
        verifyCodeTips: "获取验证码",
        countdown: 30,
        disable: true
    }

    constructor(private storage: Storage,
                private utilService: UtilService,
                private viewCtrl: ViewController,
                private userService: UserService,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController) {
        super();

        let fb = new FormBuilder();
        this.loginForm = fb.group({
            phone: ['15868823605', [phoneValidator]],
            phoneCode: ['', [numberValidator]]
        });

    }

    /**
     * 关闭当前页面
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }

    login() {
        let loading = super.showLoading(this.loadingCtrl, '登录中...');
        if (this.loginForm.valid) {
            this.loginForm.value.phoneCode = md5(this.loginForm.value.phoneCode);
            this.userService.httpPost(this.loginForm.value)
                .subscribe(
                    data => {
                        if (data.code == 0) {
                            this.storage.set('user', data.data._id);
                            loading.dismiss();
                            this.dismiss();
                            super.showToast(this.toastCtrl, '登录成功');
                        } else {
                            loading.dismiss();
                            super.showToast(this.toastCtrl, data.msg);
                        }
                    },
                    error => this.showMessage = <any>error
                );
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
        if (this.verifyCode.disable) {
            this.userService.httpGetVerifyCode(this.loginForm.value.phone).subscribe(data => {
                if (data.code == 'OK') {
                    console.log(data);
                } else {
                    this.utilService.toast(data.msg);
                }
            });
        }
        this.verifyCode.disable = false;
        this.settime();
    }
}
