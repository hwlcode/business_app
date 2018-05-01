import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CodeDetailPage} from './code-detail';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        CodeDetailPage,
    ],
    imports: [
        IonicPageModule.forChild(CodeDetailPage),
        ComponentsModule
    ],
})
export class CodeDetailPageModule {
}
