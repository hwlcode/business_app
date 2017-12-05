import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProductsPage} from './products';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        ProductsPage
    ],
    imports: [
        IonicPageModule.forChild(ProductsPage),
        ComponentsModule
    ],
})
export class ProductsPageModule {
}
