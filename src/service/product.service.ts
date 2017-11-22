import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import {CoreService} from './core.service';
import {searchRequest} from "../message/product.request";

@Injectable()
export class ProductService {

    constructor(private http: Http, private coreService: CoreService) {
    }

    httpGetProduct(): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.getProducts)
            .map(res => res.json());
    }

    httpGetProductAll(): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.products)
            .map(res => res.json());
    }

    httpProductFilter(request: searchRequest): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.search + '?keywords=' + request.keywords)
            .map(res => res.json());
    }
}
