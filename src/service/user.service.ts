import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import {CoreService} from './core.service';
import {
    PostAccessTokenRequest,
    PostAvatarRequest,
    PostBirthRequest,
    PostNameRequest,
    PostSexRequest,
    PostAddressRequest
} from "../message/user.request";

@Injectable()
export class UserService {

    constructor(private http: Http, private coreService: CoreService) {
    }

    httpPost(request: PostAccessTokenRequest): Observable<any> {
        return this.http.post(this.coreService.domain + this.coreService.API.login, request)
            .map(res => res.json());
    }

    httpGetUser(id: string): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.profile + '?id=' + id)
            .map(res => res.json());
    }

    httpPostAvatar(request: PostAvatarRequest): Observable<any> {
        return this.http.post(this.coreService.domain + this.coreService.API.saveProfile, request)
            .map(res => res.json());
    }

    httpPostName(request: PostNameRequest): Observable<any> {
        return this.http.post(this.coreService.domain + this.coreService.API.saveProfile, request)
            .map(res => res.json());
    }

    httpPostSex(request: PostSexRequest): Observable<any> {
        return this.http.post(this.coreService.domain + this.coreService.API.saveProfile, request)
            .map(res => res.json());
    }

    httpPostBirth(request: PostBirthRequest): Observable<any> {
        return this.http.post(this.coreService.domain + this.coreService.API.saveProfile, request)
            .map(res => res.json());
    }

    httpPostAddress(request: PostAddressRequest): Observable<any> {
        return this.http.post(this.coreService.domain + this.coreService.API.saveProfile, request)
            .map(res => res.json());
    }

    httpGetVerifyCode(phone: string): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.verifyCode + '?phone=' + phone)
            .map(res => res.json());
    }

    httpGetAdminId(): Observable<any> {
        return this.http.get(this.coreService.domain + '/api/get_admin_id')
            .map(res => res.json());
    }
}
