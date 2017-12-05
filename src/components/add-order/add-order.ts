import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'add-order',
    templateUrl: 'add-order.html'
})
export class AddOrderComponent{
    @Input() num: number = 0;
    @Output() numChange: EventEmitter<number> = new EventEmitter();
    constructor() {

    }

    add() {
        this.num++;
        this.numChange.emit(this.num);
    }

    remove() {
        if (this.num > 0) {
            this.num--;
        }
        this.numChange.emit(this.num);
    }
}

