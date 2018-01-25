import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { switchMap, map, catchError } from 'rxjs/operators';

import { Store as OldStore } from '../providers/store';

import * as fromEvents from '../store/events';

@Injectable()
export default class Effects {
  constructor(private actions$: Actions, private oldStore: OldStore) { }

  @Effect()
  public load = this.actions$.ofType(fromEvents.LOAD).pipe(
    switchMap((action: any) => fromPromise(this.oldStore.get('EVENTS')).pipe(
      map(events => ({
        type: fromEvents.LOAD_SUCCESS,
        payload: events.events,
      })),
      catchError(err => of({
        type: fromEvents.LOAD_FAIL,
        payload: err,
      })),
    ))
  );
}
