import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  Loading,
  LoadingController
} from 'ionic-angular';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState, SET_SELECTED, getSelected, getEvents, getEventsList } from '../../store/events';
import { LOAD } from '../../store';

import { Store as OldStore } from '../../providers/store';
import { Log } from '../../providers/log';

import { expand } from '../../components/animations';

interface AppState {
  events: EventsState;
}

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
  animations: [expand],
})
export class Events {
  public events;
  public selected;
  private loading: Loading = this.loadingCtrl.create();

  constructor(
    private nav: NavController,
    private loadingCtrl: LoadingController,
    private oldStore: OldStore,
    private log: Log,
    private store$: Store<AppState>,
  ) {
    this.selected = store$.select(getSelected);
    // this.events = store$.select(getEventsList);
  }

  async ionViewDidLoad() {
    await this.loading.present();
    // this.store$.dispatch({
    //   type: LOAD,
    //   payload: 'EVENTS',
    // });
    try {
      let events = await this.oldStore.get('EVENTS');
      this.events = events.events;
    } catch (err) {
      this.log.warn(err);
    }
    this.loading.dismiss();
  }
  goSelected(id) {
    this.store$.dispatch({
      type: SET_SELECTED,
      id,
    });
  }

}
