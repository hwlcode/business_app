import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AppGlobal, AppService} from '../../app/app.service';
import {ImageService} from '../../app/image.service';
import {LoginPage} from "../login/login";
import {DatePicker} from '@ionic-native/date-picker';
import {UserNamePage} from "../user-name/user-name";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
    public isLogin: Boolean = false;

    public avatar: string;
    public phone: string;
    public code: number;
    public name: string;
    public sex: string;
    public birthday: string;
    public selectOptions: object;
    public gender: string = "先生";
    public event = {
        timeStarts: '1970-80-01'
    }

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage: Storage,
                public appService: AppService,
                public imageService: ImageService,
                private datePicker: DatePicker) {
        this.storage.get('isLogin').then(result => {
            if (result) {
                this.isLogin = true;
                (async () => {
                    await this.appService.httpGet(AppGlobal.API.profile, {
                        phone: result
                    }, (data) => {
                        if (data.code == 0) {
                            let user = data.data;
                            this.avatar = AppGlobal.domain + user.avatar.path;
                            this.phone = user.phone;
                            this.code = user.code;
                            this.name = user.name;
                            this.sex = user.sex;
                            this.birthday = user.birthday;
                        }
                    });
                })();
            }
        });
    }

    ngOnInit() {
        this.initImgSer();

        this.selectOptions = {
            title: '选择性别'
        }
    }

    // 初始化上传图片的服务
    private initImgSer() {
        this.imageService.upload.fileKey = 'file';
        this.imageService.upload.url = AppGlobal.domain + AppGlobal.API.upload; // 上传图片的url，如果同默认配置的url一致，那无须再设置
        this.imageService.upload.success = (data) => {
            this.storage.get('isLogin').then(result => {
                if (result) {
                    (async () => {
                        await this.appService.httpPost('/api/saveProfile', {
                            phone: result,
                            avatar: data.id
                        }, (data) => {
                            if (data.code == 0) {
                                // this.cd.detectChanges();
                                console.log('头像更新成功');
                            }
                        });
                    })();
                }
            });
            //上传成功后的回调处理
            this.navCtrl.setRoot(ProfilePage);
        };
        this.imageService.upload.error = (err) => {
            this.appService.toast('错误：头像上传失败！');
        };
    }

    public choosePic() {
        this.imageService.showPicActionSheet();
    }

    public goToLogin() {
        this.navCtrl.push(LoginPage);
    }

    public loginOut() {
        this.storage.remove('isLogin');
        this.navCtrl.setRoot(HomePage);
    }

    public selectDate() {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            date => console.log('Got date: ', date),
            err => console.log('Error occurred while getting date: ', err)
        );
    }

    public saveBirty(val: string) {
        if (!this.isLogin) {
            this.navCtrl.push(LoginPage);
        } else {
            this.appService.httpPost('/api/saveProfile', {
                phone: this.phone,
                birth: val
            }, res => {
                if(res.code == 0){
                    console.log('done');
                }
            })
        }
    }

    public saveSex(val: string) {
        if (!this.isLogin) {
            this.navCtrl.push(LoginPage);
        } else {
            this.appService.httpPost('/api/saveProfile', {
                phone: this.phone,
                sex: val
            }, res => {
                if(res.code == 0){
                    console.log('done');
                }
            })
        }
    }

    public changeUserName() {
        if (!this.isLogin) {
            this.navCtrl.push(LoginPage);
        } else {
            this.navCtrl.push(UserNamePage);
        }
    }

    ionViewDidLoad() {
        //页面加载完毕后 执行的事件
        console.log('ionViewDidLoad ProfilePage');
        // console.log(this.isLogin);
    }

    ionViewWillEnter() {
        //进入下一个页面前执行的事件
    }

    ionViewDidEnter() {
        //进入下一个页面后执行的事件
    }

    ionViewWillLeave() {
        // 离开当前页面 执行的事件
        // this.storage.get('isLogin').then(result => {
        //     if (result == null) {
        //         this.navCtrl.push(LoginPage);
        //     }
        // });
    }

    ionViewDidLeave() {
        //进入下一个页面后 执行的事件
    }
}
