import {Injectable} from '@angular/core';
import {File} from '@ionic-native/file';
import {FileTransferObject, FileTransfer} from "@ionic-native/file-transfer";
import {FileOpener} from "@ionic-native/file-opener";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {AlertController, Platform} from "ionic-angular";
import {AppVersion} from "@ionic-native/app-version";

@Injectable()
export class UpdateService {

    constructor(private file: File,
                private alertCtrl: AlertController,
                private fileOpener: FileOpener,
                private inAppBrowser: InAppBrowser,
                private platform: Platform,
                private appVersion: AppVersion,
                private transfer: FileTransfer) {

    }

    detectionUpgrade() {
        //这里连接后台获取app最新版本号,然后与当前app版本号(this.getVersionNumber())对比
        //版本号不一样就需要申请,不需要升级就return
        this.alertCtrl.create({
            title: '版本升级',
            subTitle: '发现新版本,是否立即更新？',
            message: '1、新增版本升级功能<br\/>2、修复了几个Bug<br\/>3、性能优化',
            buttons: [{text: '稍后更新'},
                {
                    text: '立即更新',
                    handler: () => {
                        this.downloadApp();
                    }
                }
            ]
        }).present();
    }

    downloadApp() {
        if (this.isIos()) {
            this.openUrlByBrowser("https://itunes.apple.com/cn/app/id1296700807");
        }

        if (this.isAndroid()) {
            let alert = this.alertCtrl.create({
                title: '下载进度：0%',
                enableBackdropDismiss: false,
                buttons: ['后台下载']
            });
            alert.present();

            /**
             * fileTransfer.download
             * 第一个参数，远程服务器文件地下 http://www.example.com/android.apk
             * 第二个参数，手机本地sdk存放的文件地址 this.file.externalRootDirectory + 'android.apk'
             */
            const url = 'http://admin.gxyingken.com/apk/android-debug.apk';
            const fileTransfer: FileTransferObject = this.transfer.create();
            const apk = this.file.externalRootDirectory + 'android.apk'; //apk保存的目录

            fileTransfer.download(url, apk).then(() => {
                this.fileOpener.open(apk, 'application/vnd.android.package-archive');
            });

            fileTransfer.onProgress((event: ProgressEvent) => {
                let num = Math.floor(event.loaded / event.total * 100);
                if (num === 100) {
                    alert.dismiss();
                } else {
                    let title = document.getElementsByClassName('alert-title')[0];
                    title && (title.innerHTML = '下载进度：' + num + '%');
                }
            });
        }
    }

    openUrlByBrowser(url: string): void {
        this.inAppBrowser.create(url, '_system');
    }

    isMobile(): boolean {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    }

    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }

    getVersionNumber(): Promise<string> {
        return new Promise((resolve) => {
            this.appVersion.getVersionNumber().then((value: string) => {
                resolve(value);
            }).catch(err => {
                console.log('getVersionNumber:' + err);
            });
        });
    }
}
