import {Injectable} from '@angular/core';

@Injectable()
export class CoreService {

    constructor() {
    }

    //接口基地址
    public domain = "http://localhost";

    // public domain = "http://47.96.16.226";
    // public domain = "http://192.168.20.92:8000";

    //接口地址
    public API: any = {
        getBanner: '/api/web/banners',
        getProducts: '/api/productList',
        verifyCode: '/api/verifyCode',
        profile: '/api/profile',
        login: '/api/user/login',
        upload: '/api/upload',
        uploadAvatar: '/api/upload/avatar',
        products: '/api/web/productList',
        saveProfile: '/api/saveProfile',
        search: '/api/products/list'  // 都用这个来取产品
    };
}
