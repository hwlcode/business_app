import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {CoreService} from "./core.service";
import {OrderRequest} from "../message/order.request";

@Injectable()
export class OrderService {

    constructor(public http: Http,
                public coreService: CoreService) {

    }

    httpPostOrder(request: OrderRequest): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.orderAdd + '?products=' + request.products + '&sumPrice=' + request.sumPrice + '&customer=' + request.customer)
            .map(res => res.json());
    }

    httpGetOrderById(id: string): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.orderList + '?id=' + id)
            .map(res => res.json());
    }

    httpUpdateOrderById(id: string): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.updateOrder + '/' + id)
            .map(res => res.json());
    }
}
