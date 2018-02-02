import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Homework } from './homework';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { homeworkReducer } from '../../store/homework'

@NgModule({
  declarations: [Homework],
  imports: [
    IonicPageModule.forChild(Homework),
    TranslateModule.forChild(),
    StoreModule.forFeature('homework', homeworkReducer),
  ],
  exports: [Homework],
})
export class HomeworkModule {}
