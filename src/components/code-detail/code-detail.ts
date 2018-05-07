import {Component} from '@angular/core';

/**
 * Generated class for the CodeDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'code-detail',
    templateUrl: 'code-detail.html'
})
export class CodeDetailComponent {

    text: string;

    constructor() {
        // console.log('Hello CodeDetailComponent Component');
        this.text = 'Hello World';
    }

}
