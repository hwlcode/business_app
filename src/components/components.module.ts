import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";
import {NumCountComponent} from "./num-count/num-count";

@NgModule({
    declarations: [
        NumCountComponent
    ],
    imports: [
        IonicModule
    ],
    exports: [
        NumCountComponent
    ]
})
export class ComponentsModule {
}
