import {Component, OnInit} from '@angular/core';
import {
    IonicPage, LoadingController, ModalController, NavController, ToastController,
} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ImageService} from '../../service/image.service';
import {LoginPage} from "../login/login";
import {UserNamePage} from "../user-name/user-name";
import {UserService} from "../../service/user.service";
import {UtilService} from "../../service/util.service";
import {CoreService} from "../../service/core.service";
import {UserAddressPage} from "../user-address/user-address";
import {BaseUI} from "../../common/baseui";
import {OrdersPage} from "../orders/orders";
import {VersionPage} from "../version/version";

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage extends BaseUI implements OnInit {
    title = '登录';
    headFace: string = 'assets/user.png';
    userInfo: any;
    notLogin: boolean = true;
    logined: boolean = false;

    selectOptions: object;
    event = {
        timeStarts: '1970-80-01'
    };
    gender: string = "先生";
    name: string = '';
    code: number = 0;
    phone: string = '';

    errorMessage: any;

    constructor(private navCtrl: NavController,
                private storage: Storage,
                private userService: UserService,
                private imageService: ImageService,
                private coreService: CoreService,
                private modalCtrl: ModalController,
                private loadCtrl: LoadingController,
                private toastCtrl: ToastController,
                private utilService: UtilService) {
        super();
    }

    ngOnInit() {
        this.initImgSer();
        this.selectOptions = {
            title: '选择性别'
        }
    }

    showLoginModal() {
        let modal = this.modalCtrl.create(LoginPage);
        modal.onDidDismiss(() => {
            this.loadUserPage();
        });
        modal.present();
    }

    ionViewDidEnter() {
        this.loadUserPage();
    }

    loadUserPage() {
        this.storage.get('user').then(val => {
            // let loading = super.showLoading(this.loadCtrl, '加载中...');
            if (val != null) {
                this.userService.httpGetUser(val).subscribe(
                    userInfo => {
                        this.userInfo = userInfo['data'];
                        //去除图片头像的缓存
                        if (userInfo['data'] == null) {
                            this.headFace = 'assets/user.png';
                        } else {
                            if(userInfo['data']['avatar'] == null){
                                this.headFace = 'assets/user.png';
                            }else{
                                this.headFace = this.coreService.domain + userInfo['data']['avatar']['path'] + "?v=" + new Date().valueOf();
                            }
                            this.gender = userInfo['data'].sex;
                            this.event.timeStarts = userInfo['data'].birth;
                            this.name = userInfo['data'].name;
                            this.code = userInfo['data'].code;
                            this.phone = userInfo['data'].phone;
                        }

                        this.notLogin = false;
                        this.logined = true;
                        this.title = '个人中心';
                        // loading.dismiss();
                    },
                    error => this.errorMessage = <any>error
                )
            } else {
                this.notLogin = true;
                this.logined = false;
                this.title = '登录';
                this.headFace = 'assets/user.png';
                // loading.dismiss();
            }
        });
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
            this.storage.get('user').then(id => {
                if (id != null) {
                    this.userService.httpPostAvatar({
                        id: id,
                        avatar: data.id
                    }).subscribe(data => {
                        if (data.code == 0) {
                            // this.cd.detectChanges();
                            console.log('头像更新成功');
                            //上传成功后的回调处理
                            this.loadUserPage();
                            // this.navCtrl.setRoot(ProfilePage);
                        }
                    })
                }
            })
        };

        this.imageService.upload.error = (err) => {
            this.utilService.toast('错误：头像上传失败！');
        };
    }

    // 更改姓名
    changeUserName() {
        this.navCtrl.push(UserNamePage, {user: this.userInfo});
    }

    // 更改性别
    saveSex(val: string) {
        let loading = super.showLoading(this.loadCtrl, '保存中...');
        this.storage.get('user').then(id => {
            if (id != null) {
                this.userService.httpPostSex({
                    id: id,
                    sex: val
                }).subscribe(data => {
                    if (data.code == 0) {
                        this.gender = data.data.sex;
                        loading.dismiss();
                        super.showToast(this.toastCtrl, '更新成功。');
                        // console.log('done');
                    }
                });
            }
        })
    }

    // 更改生日
    saveBirty(val: string) {
        let loading = super.showLoading(this.loadCtrl, '保存中...');
        this.storage.get('user').then(id => {
            if (id != null) {
                this.userService.httpPostBirth({
                    id: id,
                    birth: val
                }).subscribe(data => {
                    if (data.code == 0) {
                        loading.dismiss();
                        super.showToast(this.toastCtrl, '更新成功。');
                        // console.log('done');
                    }
                });
            }
        })
    }

    goToAddress() {
        this.navCtrl.push(UserAddressPage, {user: this.userInfo});
    }

    goToOrders() {
        this.navCtrl.push(OrdersPage);
    }

    loginOut() {
        this.storage.remove('user');
        this.loadUserPage();
    }

    goToVersion() {
        this.navCtrl.push(VersionPage);
    }
}
