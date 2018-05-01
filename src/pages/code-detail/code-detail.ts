import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from "../../service/user.service";
import {Http} from "@angular/http";
import {UtilService} from "../../service/util.service";

@IonicPage()
@Component({
    selector: 'page-code-detail',
    templateUrl: 'code-detail.html',
})
export class CodeDetailPage implements OnInit {
    userInfo: Object = {};
    userId: string;
    errorMessage: any;
    product: any;
    orderNum: number = 1;
    sumCode: number = 0;
    userCode: number = 0;
    isHidden: boolean = true;

    constructor(public navCtrl: NavController,
                public storage: Storage,
                public userService: UserService,
                public http: Http,
                public utilService: UtilService,
                public navParams: NavParams) {
        this.product = navParams.get('product');
        this.sumCode = this.orderNum * this.product.code;
    }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.storage.get('user').then(val => {
            if (val != null) {
                this.userId = val;
                this.userService.httpGetUser(val).subscribe(
                    userInfo => {
                        this.userInfo = userInfo['data'];
                        this.userCode = userInfo['data']['code'];

                        if (this.userCode < this.sumCode) {
                            this.isHidden = false;
                        } else {
                            this.isHidden = true;
                        }
                    },
                    error => this.errorMessage = <any>error
                )
            }
        });
    }

    chooseProduct(product) {
        if (this.orderNum < 1) {
            this.orderNum = 1;
        }
        this.sumCode = this.orderNum * product.code;
        if (this.userCode < this.sumCode) {
            this.isHidden = false;
        } else {
            this.isHidden = true;
        }
    }

    commit() {
        this.product.orderNum = this.orderNum;
        this.http.post('/api/update_code/', {
            id: this.userId,
            product: this.product
        }).map(res => res.json()).subscribe(
            json => {
                if(json.code == 0){
                    this.utilService.alert('兑换商品成功，我们将尽快为您发货！', () => {
                        this.navCtrl.pop();
                    });
                }
            }
        )
    }

}
