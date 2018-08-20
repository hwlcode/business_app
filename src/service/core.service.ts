import {Injectable} from '@angular/core';

@Injectable()
export class CoreService {

    constructor() {
    }

    //接口基地址
    // 线上
    // public domain = 'http://admin.gxyingken.com';

    //线下 （用nginx模拟本地api服务，就可以真机调试，详见business_api.conf，这样就可以用本地IP访问了）
    public domain = 'http://192.168.1.102';

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
        search: '/api/products/list',  // 都用这个来取产品
        orderAdd: '/api/order/add',
        orderList:  '/api/order/list',
        updateOrder: '/api/order/confirm_order',
        userNotificationList: '/api/notification',
        delUserNotification: '/api/notification/delete',
        readUserNotification: '/api/notification/read',
        unReadUserNotification: '/api/notification/unread'
    };
}
