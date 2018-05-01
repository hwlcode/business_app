import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import {CoreService} from './core.service';

@Injectable()
export class BannerService {

    constructor(private http: Http, private coreService: CoreService) {
    }

    httpGetBanner(): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.getBanner)
            .map(res => res.json());
    }
}
