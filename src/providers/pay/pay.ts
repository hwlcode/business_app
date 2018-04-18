import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {CoreService} from "../../service/core.service";
import {aliPayRequest, wechatPayRequest} from "../../message/pay.request";

/*
  Generated class for the PayProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PayProvider {

    constructor(public http: Http,
                public coreService: CoreService) {
        // console.log('Hello PayProvider Provider');
    }

    alipay(request: aliPayRequest): Observable<any> {
        return this.http.get(this.coreService.domain + '/alipay')
            .map(res => res.json());
    }

    wechatpay(request: wechatPayRequest): Observable<any> {
        return this.http.get(this.coreService.domain + '/wechatpay')
            .map(res => res.json());
    }

}
