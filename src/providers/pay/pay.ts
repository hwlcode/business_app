import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {CoreService} from "../../service/core.service";
import {payInfoRequest} from "../../message/pay.request";

@Injectable()
export class PayProvider {

    constructor(public http: Http,
                public coreService: CoreService) {
    }

    postPayInfo(request: payInfoRequest): Observable<any> {
        return this.http.get(this.coreService.domain + '/api/pay_info?subject=' + request.subject + '&body=' + request.body + '&amount=' + request.amount + '&outTradeId=' + request.outTradeId)
            .map(res => res.json());
    }

    queryOrder(sn: string, tradeId: string): Observable<any> {
        return this.http.get(this.coreService.domain + '/api/query_order?sn=' + sn + '&trade_id=' + tradeId)
            .map(res => res.json());
    }
}
