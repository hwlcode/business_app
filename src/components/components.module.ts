import {NgModule} from '@angular/core';
import {AddOrderComponent} from './add-order/add-order';
import {IonicModule} from "ionic-angular";

@NgModule({
    declarations: [
        AddOrderComponent
    ],
    imports: [
        IonicModule
    ],
    exports: [
        AddOrderComponent,
    ]
})
export class ComponentsModule {
}
