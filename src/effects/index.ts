import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { switchMap, map, catchError } from 'rxjs/operators';

import { Store as OldStore } from '../providers/store';

import * as fromEvents from '../store/events';
import * as fromStaff from '../store/staff';

@Injectable()
export default class Effects {
  constructor(private actions$: Actions, private oldStore: OldStore) { }

  loadFactory(type, load, success, fail) {
    return this.actions$.ofType(load).pipe(
      switchMap((action: any) => fromPromise(this.oldStore.get(type)).pipe(
        map(payload => ({
          type: success,
          payload,
        })),
        catchError(payload => of({
          type: fail,
          payload,
        })),
      )),
    );
  }

  @Effect()
  public loadEvents = this.loadFactory(
    'EVENTS',
    fromEvents.LOAD,
    fromEvents.LOAD_SUCCESS,
    fromEvents.LOAD_FAIL,
  );

  @Effect()
  public loadStaff = this.loadFactory(
    'STAFF',
    fromStaff.LOAD,
    fromStaff.LOAD_SUCCESS,
    fromStaff.LOAD_FAIL,
  );
}
