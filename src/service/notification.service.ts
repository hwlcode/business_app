import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {CoreService} from "./core.service";

@Injectable()
export class NotificationService {

    constructor(public http: Http,
                public coreService: CoreService) {

    }

    getUserNotificationList(userId: string): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.userNotificationList + '?id=' + userId)
            .map(res => res.json());
    }

    delUserNotification(id: string): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.delUserNotification + '?id=' + id)
            .map(res => res.json());
    }

    readUserNotification(id: string): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.readUserNotification + '?id=' + id)
            .map(res => res.json());
    }

    unReadUserNotification(id: string): Observable<any> {
        return this.http.get(this.coreService.domain + this.coreService.API.unReadUserNotification + '?id=' + id)
            .map(res => res.json());
    }
}
