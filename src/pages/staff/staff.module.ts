import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Staff } from './staff';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { staffReducer } from '../../store/staff';

@NgModule({
  declarations: [Staff],
  imports: [
    IonicPageModule.forChild(Staff),
    TranslateModule.forChild(),
    StoreModule.forFeature('staff', staffReducer)
  ],
  exports: [Staff]
})
export class StaffModule {}
