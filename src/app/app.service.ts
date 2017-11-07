import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";

@Injectable()
export class AppGlobal {
    //缓存key的配置
    static cache: any = {

    }

    //接口基地址
    static domain = "http://192.168.20.44:8000"

    //接口地址
    static API: any = {
        getBanner: '/api/web/banners',
        getProducts: '/api/productList',
        verifyCode: '/api/verifyCode',
        profile: '/api/profile',
        login: '/api/user/login',
        upload: '/api/upload',
        uploadAvatar: '/api/upload/avatar',
        products: '/api/web/productList'
    };
}

@Injectable()
export class AppService {

    constructor(public http: Http, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, ) { }

    // 对参数进行编码
    encode(params) {
        var str = '';
        if (params) {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var value = params[key];
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = '?' + str.substring(0, str.length - 1);
        }
        return str;
    }

    httpGet(url, params, callback, loader: boolean = false) {
        let loading = this.loadingCtrl.create({});
        if (loader) {
            loading.present();
        }

        this.http.get(AppGlobal.domain + url + this.encode(params))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            })
            .catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                this.handleError(error);
            });
    }

    httpPost(url, params, callback, loader: boolean = false) {
        let loading = this.loadingCtrl.create();
        if (loader) {
            loading.present();
        }
        this.http.post(AppGlobal.domain + url, params)
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
            if (loader) {
                loading.dismiss();
            }
            this.handleError(error);
        });
    }

    private handleError(error: Response | any) {
        // this.alert(error);
        let msg = '';
        if (error.status == 400) {
            msg = '请求无效(code：404)';
            console.log('请检查参数类型是否匹配');
        }
        if (error.status == 404) {
            msg = '请求资源不存在(code：404)';
            console.error(msg + '，请检查路径是否正确');
        }
        if (error.status == 500) {
            msg = '服务器发生错误(code：500)';
            console.error(msg + '，请检查路径是否正确');
        }
        if (msg != '') {
            this.toast(msg);
        }
    }

    alert(message, callback?) {
        if (callback) {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: [{
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

    setItem(key: string, obj: any) {
        try {
            var json = JSON.stringify(obj);
            window.localStorage[key] = json;
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }
    //ionic2开始storage默认使用的是IndexedDB，而不是LocalStorage
    getItem(key: string, callback) {
        try {
            var json = window.localStorage[key];
            var obj = JSON.parse(json);
            callback(obj);
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }
}
