import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  Loading,
  LoadingController
} from 'ionic-angular';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import * as fromRoot from '../../store';
import * as fromEvents from '../../store/events';

import { Store as OldStore } from '../../providers/store';
import { Log } from '../../providers/log';

import { expand } from '../../components/animations';


@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
  animations: [expand],
})
export class Events {
  public events$: Store<any[]>;
  public selected$: Store<string | null>;
  public today$: Store<string>
  private loading: Loading = this.loadingCtrl.create();

  constructor(
    private nav: NavController,
    private loadingCtrl: LoadingController,
    private oldStore: OldStore,
    private log: Log,
    private store$: Store<{ events: fromEvents.EventsState }>,
  ) { }

  async ionViewDidLoad() {
    await this.loading.present();

    this.selected$ = this.store$.select(fromEvents.getSelected);
    this.events$ = this.store$.select(fromEvents.getEventsList);
    this.today$ = this.store$.select(fromRoot.getToday);

    this.store$.dispatch(new fromEvents.Load());

    this.store$
      .select(fromEvents.getEventsLoaded)
      .pipe(filter(loaded => loaded))
      .subscribe(() => this.loading.dismiss());
  }

  goSelected(id) {
    this.store$.dispatch(new fromEvents.SetSelected(id));
  }
}
