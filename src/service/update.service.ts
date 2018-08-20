import {Injectable} from '@angular/core';
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {FileOpener} from '@ionic-native/file-opener';
import {AlertController} from 'ionic-angular';
import {UtilService} from "./util.service";
import {Http} from "@angular/http";

@Injectable()
export class UpdateService {
    appName; // 如app name
    appType; // android 或 ios
    currentVersionNo; // 当前版本号
    latestVersionNo; // 最新版本号
    lastVersionInfo; // 从后台获取到的app最新版本信息
    versions; // app更新日志

    appDownloadPageUrl = 'https://fir.im/emzu'; // 下载页访问地址
    iosUrl; // ios 下载地址
    apkUrl; // android apk地址

    // app更新进度.默认为0,在app升级过程中会改变
    updateProgress = -1;

    constructor(public transfer: FileTransfer,
                public file: File,
                public utilService: UtilService,
                public fileOpener: FileOpener,
                public http: Http,
                public alertCtrl: AlertController,) {

    }

    checkVersion() {
        if (!this.utilService.isMobile()) {
            return;
        }

        // 获得app当前版本号
        this.utilService.getVersionNumber().subscribe(
            currentVersionNo => {
                this.currentVersionNo = currentVersionNo;

                this.http.get('/api/admin/get/version')
                    .map(res => res.json())
                    .subscribe(res => {
                        if (!res || res.code != 0) {
                            console.log('从版本管理服务中获取版本信息失败');
                            return;
                        }

                        if (res.code == 0 && res.data && !res.data.versionNumber) {
                            console.log('从版本管理服务中未找到最新版本信息');
                            return;
                        }

                        const data = res.data;
                        this.lastVersionInfo = data.version;
                        this.latestVersionNo = data.versionNumber;
                        this.iosUrl = data.iosUrl;
                        this.apkUrl = data.androidUrl;

                        if (this.latestVersionNo && (this.currentVersionNo == this.latestVersionNo)) {
                            console.log('已经是最新版本');
                            return;
                        }

                        const cNo = parseInt(this.currentVersionNo.replace(/\./g, ''), 10);
                        const lNo = parseInt(this.latestVersionNo.replace(/\./g, ''), 10);
                        if(cNo < lNo){
                            const that = this;
                            let alert = this.alertCtrl.create({
                                title: '升级',
                                subTitle: '发现新版本,是否立即升级？',
                                enableBackdropDismiss: false,
                                buttons: [{text: '取消'}, {
                                    text: '确定', handler: () => {
                                        that.downloadApp();
                                    }
                                }]
                            });
                            alert.present();
                        }
                    }, err => {
                        console.log(err, '从版本管理服务中获取版本信息失败');
                    });
            }
        )

    }

    /**
     * 下载app
     */
    downloadApp() {
        if (this.utilService.isIos()) {
            // ios打开网页下载
            console.log(this.iosUrl);
            this.utilService.openUrlByBrowser(this.iosUrl);
        }

        if (this.utilService.isAndroid()) {// android本地下载
            if (!this.apkUrl) {
                this.utilService.alert('未找到android apk下载地址');
                return;
            }

            this.utilService.externalStoragePermissionsAuthorization().subscribe(() => {
                let backgroundProcess = false; // 是否后台下载

                let alert; // 显示下载进度
                alert = this.alertCtrl.create({
                    title: '下载进度：0%',
                    enableBackdropDismiss: false,
                    buttons: [{
                        text: '后台下载', handler: () => {
                            backgroundProcess = true;
                        }
                    }]
                });
                alert.present();

                // 下载并安装apk
                const fileTransfer: FileTransferObject = this.transfer.create();
                const apk = this.file.externalRootDirectory + 'download/' + `android_${new Date().getTime()}.apk`; // 下载apk保存的目录
                console.log(this.apkUrl);
                fileTransfer.download(this.apkUrl, apk).then((entry) => {
                    alert && alert.dismiss();
                    console.log('download complete: ' + entry.toURL());
                    // 如果出现应用未安装的现象，请确保两个apk的源是同一个，可以看笔记
                    this.fileOpener.open(entry.toURL(), 'application/vnd.android.package-archive');
                }, err => {
                    this.updateProgress = -1;
                    alert && alert.dismiss();
                    console.log(err, 'android app 本地升级失败');
                    this.alertCtrl.create({
                        title: '前往网页下载',
                        subTitle: '本地升级失败',
                        buttons: [{
                            text: '确定', handler: () => {
                                this.utilService.openUrlByBrowser(this.appDownloadPageUrl); // 打开网页下载
                            }
                        }
                        ]
                    }).present();
                });

                // 显示下载进度
                let timer = null; // 由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
                fileTransfer.onProgress((event: ProgressEvent) => {
                    const progress = Math.floor(event.loaded / event.total * 100); // 下载进度
                    this.updateProgress = progress;
                    if (!timer) {
                        // 更新下载进度
                        timer = setTimeout(() => {
                            if (progress === 100) {
                                alert && alert.dismiss();
                            } else {
                                if (!backgroundProcess) {
                                    const title = document.getElementsByClassName('alert-title')[0];
                                    title && (title.innerHTML = `下载进度：${progress}%`);
                                }
                            }
                            clearTimeout(timer);
                            timer = null;
                        }, 1000);
                    }
                });
            });
        }
    }
}
