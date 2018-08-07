import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AlertController, Platform, ToastController} from "ionic-angular";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import { Observable } from 'rxjs/Rx';
import {AppVersion} from "@ionic-native/app-version";
import { Diagnostic } from '@ionic-native/diagnostic';

declare var AlloyLever;

@Injectable()
export class UtilService {

    constructor(public storage: Storage,
                public toastCtrl: ToastController,
                private platform: Platform,
                private inAppBrowser: InAppBrowser,
                private appVersion: AppVersion,
                private diagnostic: Diagnostic,
                private alertCtrl: AlertController) {
    }

    getTabs(): Array<{ key: string, value: string, icon: string, page: string }> {
        return [
            {
                key: 'home',
                value: '首页',
                icon: 'home',
                page: 'HomePage'
            },
            {
                key: 'shopping',
                value: '积分商城',
                icon: 'basket',
                page: 'ShoppingPage'
            },
            {
                key: 'notifications',
                value: '通知',
                icon: 'notifications',
                page: 'NotificationPage'
            },
            {
                key: 'contact',
                value: '我的',
                icon: 'contact',
                page: 'ProfilePage'
            }]
    }

    getLoginStatus() {
        return this.storage.get('user').then((val) => {
            return val;
        })
    }

    getFirstIn() {
        return this.storage.get('firstIn').then((val) => {
            return val;
        })
    }

    toast(message, callback?) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 5000,
            dismissOnPageChange: true,
        });
        toast.present();
        if (callback) {
            callback();
        }
    }

    alert(message, callback?) {
        if (callback) {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: [
                    {
                        text: '取消',
                        handler: data => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: "确定",
                        handler: data => {
                            callback();
                        }
                    }]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: ["确定"]
            });
            alert.present();
        }
    }

    /**
     * 通过浏览器打开url
     */
    openUrlByBrowser(url: string): void {
        this.inAppBrowser.create(url, '_system');
    }

    /**
     * 是否真机环境
     */
    isMobile(): boolean {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    }

    /**
     * 是否android真机环境
     */
    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    /**
     * 是否ios真机环境
     */
    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }

    /**
     * 获得app版本号,如0.01
     * @description  对应/config.xml中version的值
     */
    getVersionNumber(): Observable<string> {
        return Observable.create(observer => {
            this.appVersion.getVersionNumber().then((value: string) => {
                observer.next(value);
            }).catch(err => {
                console.log(err, '获得app版本号失败');
                observer.error(false);
            });
        });
    }

    /**
     * 获得app包名/id,如com.kit.ionic2tabs
     * @description  对应/config.xml中id的值
     */
    getPackageName(): Observable<string> {
        return Observable.create(observer => {
            this.appVersion.getPackageName().then((value: string) => {
                observer.next(value);
            }).catch(err => {
                console.log(err, '获得app包名失败');
                observer.error(false);
            });
        });
    }

    /**
     * 每次调用sequence加1
     * @type {()=>number}
     */
     getSequence = (() => {
        let sequence = 1;
        return () => {
            return ++sequence;
        };
    })();

    /**
     * 检测app是否有读取存储权限,如果没有权限则会请求权限
     */
    externalStoragePermissionsAuthorization = (() => {
        let havePermission = false;
        return () => {
            return Observable.create(observer => {
                if (havePermission) {
                    observer.next(true);
                } else {
                    const permissions = [this.diagnostic.permission.READ_EXTERNAL_STORAGE, this.diagnostic.permission.WRITE_EXTERNAL_STORAGE];
                    this.diagnostic.getPermissionsAuthorizationStatus(permissions).then(res => {
                        if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
                            havePermission = true;
                            observer.next(true);
                        } else {
                            havePermission = false;
                            this.diagnostic.requestRuntimePermissions(permissions).then(res => {// 请求权限
                                if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
                                    havePermission = true;
                                    observer.next(true);
                                } else {
                                    havePermission = false;
                                    this.alertCtrl.create({
                                        title: '缺少读取存储权限',
                                        subTitle: '请在手机设置或app权限管理中开启',
                                        buttons: [{text: '取消'},
                                            {
                                                text: '去开启',
                                                handler: () => {
                                                    this.diagnostic.switchToSettings();
                                                }
                                            }
                                        ]
                                    }).present();
                                    observer.error(false);
                                }
                            }).catch(err => {
                                console.log(err, '调用diagnostic.requestRuntimePermissions方法失败');
                                observer.error(false);
                            });
                        }
                    }).catch(err => {
                        console.log(err, '调用diagnostic.getPermissionsAuthorizationStatus方法失败');
                        observer.error(false);
                    });
                }
            });
        };
    })();

    /**
     * AlloyLever,一款本地"开发者工具"
     * 文档:https:// github.com/AlloyTeam/AlloyLever
     */
    alloyLeverInit() {
        AlloyLever.config({
            cdn: 'http://s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js',  // vconsole的CDN地址
            /*reportUrl: "// a.qq.com",  // 错误上报地址
            reportPrefix: 'qun',    // 错误上报msg前缀，一般用于标识业务类型
            reportKey: 'msg',        // 错误上报msg前缀的key，用户上报系统接收存储msg
            otherReport: {              // 需要上报的其他信息
              uin: 491862102
            },*/
            entry: '#entry'         // 请点击这个DOM元素6次召唤vConsole。// 你可以通过AlloyLever.entry('#entry2')设置多个机关入口召唤神龙
        });
    }
}
