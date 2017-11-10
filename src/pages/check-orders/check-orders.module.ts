import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckOrdersPage } from './check-orders';

@NgModule({
  declarations: [
    CheckOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckOrdersPage),
  ],
})
export class CheckOrdersPageModule {}
