import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {CoreService} from "./core.service";
import {NotificationRequest} from "../message/notification.request";

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

    createNotification(request: NotificationRequest): Observable<any> {
        return this.http.get(this.coreService.domain + '/api/notification/create/' + request.content + '/' + request.from + '/' + request.to)
            .map(res => res.json());
    }

    msgToBusiness(phone: string, no: string): Observable<any> {
        return this.http.get(this.coreService.domain + '/api/msg_to_business?phone=' + phone + '&no=' + no).map(res => res.json());
    }
}
