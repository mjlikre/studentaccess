import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Events } from './events';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { eventsReducer } from '../../store/events'

@NgModule({
  declarations: [Events],
  imports: [
    IonicPageModule.forChild(Events),
    TranslateModule.forChild(),
    StoreModule.forFeature('events', eventsReducer),
  ],
  exports: [Events]
})
export class EventsModule {}
