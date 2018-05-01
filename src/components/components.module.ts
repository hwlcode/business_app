import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";
import {NumCountComponent} from "./num-count/num-count";
import { CodeDetailComponent } from './code-detail/code-detail';

@NgModule({
    declarations: [
        NumCountComponent,
    CodeDetailComponent
    ],
    imports: [
        IonicModule
    ],
    exports: [
        NumCountComponent,
    CodeDetailComponent
    ]
})
export class ComponentsModule {
}
