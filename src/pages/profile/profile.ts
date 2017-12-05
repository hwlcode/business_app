import {Component, OnInit} from '@angular/core';
import {Events, IonicPage, NavController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ImageService} from '../../service/image.service';
import {LoginPage} from "../login/login";
import {UserNamePage} from "../user-name/user-name";
import {HomePage} from "../home/home";
import {UserService} from "../../service/user.service";
import {UtilService} from "../../service/util.service";
import {CoreService} from "../../service/core.service";
import {UserAddressPage} from "../user-address/user-address";

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
    user: any;
    loginPhone: string;
    selectOptions: object;
    isLogin: boolean = false;
    event = {
        timeStarts: '1970-80-01'
    };
    gender: string = "先生";

    constructor(private navCtrl: NavController,
                private storage: Storage,
                private userService: UserService,
                private imageService: ImageService,
                private coreService: CoreService,
                private events: Events,
                private utilService: UtilService) {
        // 初始化默认值
        this.user = {
            avatar: '',
            phone: '',
            code: 0,
            name: ''
        };

        this.utilService.getLoginStatus().then(data => {
            if (data) {
                this.loginPhone = data.phone;
                this.gender = data.sex;
                this.event.timeStarts = data.birth;
                this.isLogin = true;

                this.getUser();
            }
        });
    }

    ngOnInit() {
        this.initImgSer();
        this.selectOptions = {
            title: '选择性别'
        }
        if (this.isLogin) {
            this.getUser();
        }
    }

    //登录后获取用户信息
    private getUser() {
        this.userService.httpGetUser(this.loginPhone).subscribe(data => {
            if (data.code == 0) {
                this.user = data.data;
                this.user.avatar = this.coreService.domain + this.user.avatar.path;
                this.storage.set('user', data.data);
            }
        })
    }

    //选择上传方式
    choosePic() {
        this.imageService.showPicActionSheet();
    }

    // 初始化上传图片的服务
    private initImgSer() {
        this.imageService.upload.fileKey = 'file';
        this.imageService.upload.url = this.coreService.domain + this.coreService.API.upload; // 上传图片的url，如果同默认配置的url一致，那无须再设置

        this.imageService.upload.success = (data) => {
            this.userService.httpPostAvatar({
                phone: this.loginPhone,
                avatar: data.id
            }).subscribe(data => {
                if (data.code == 0) {
                    // this.cd.detectChanges();
                    console.log('头像更新成功');
                    //上传成功后的回调处理
                    this.navCtrl.setRoot(ProfilePage);
                }
            })
        };

        this.imageService.upload.error = (err) => {
            this.utilService.toast('错误：头像上传失败！');
        };
    }

    // 更改姓名
    changeUserName() {
        this.navCtrl.push(UserNamePage);
    }

    // 更改性别
    saveSex(val: string) {
        this.userService.httpPostSex({
            phone: this.loginPhone,
            sex: val
        }).subscribe(data => {
            if (data.code == 0) {
                console.log('done');
            }
        });
    }

    // 更改生日
    saveBirty(val: string) {
        this.userService.httpPostBirth({
            phone: this.loginPhone,
            birth: val
        }).subscribe(data => {
            if (data.code == 0) {
                console.log('done');
            }
        });
    }

    goToLogin() {
        this.navCtrl.push(LoginPage);
    }

    goToAddress() {
        this.events.publish('user:message', this.user);
        this.navCtrl.push(UserAddressPage);
    }

    loginOut() {
        this.storage.remove('user');
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.parent.select(0);
    }
}
