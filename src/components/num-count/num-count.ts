import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const NUM_COUNT_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumCountComponent),
    multi: true
};

@Component({
    selector: 'num-count',
    templateUrl: 'num-count.html',
    providers: [NUM_COUNT_ACCESSOR]
})
export class NumCountComponent implements ControlValueAccessor {
    count: number = 0;
    onChanged: Function = (_: any) => {}; // 这里要给一个值

    constructor() {
        // console.log(this);
    }

    writeValue(obj: any): void {
        if (obj) {
            this.count = obj;
        }
    }

    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: any): void {

    }

    increment(): any {
        this.count++;
        this.onChanged(this.count);
    }

    decrement(): any {
        if(this.count > 0){
            this.count--;
        }
        this.onChanged(this.count);
    }
}
