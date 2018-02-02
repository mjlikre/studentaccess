import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { Store as OldStore } from '../providers/store';

import * as fromEvents from '../store/events';
import * as fromStaff from '../store/staff';
import * as fromHomework from '../store/homework';

@Injectable()
export default class Effects {
  constructor(private actions$: Actions, private oldStore: OldStore) { }

  loadFactory(load, success, fail, key, modifier?) {
    return this.actions$.ofType(load).pipe(
      switchMap((action: any) => fromPromise(this.oldStore.get(key, modifier, action.payload)).pipe(
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
    fromEvents.LOAD,
    fromEvents.LOAD_SUCCESS,
    fromEvents.LOAD_FAIL,
    'EVENTS',
  );

  @Effect()
  public loadStaff = this.loadFactory(
    fromStaff.LOAD,
    fromStaff.LOAD_SUCCESS,
    fromStaff.LOAD_FAIL,
    'STAFF',
  );

  @Effect()
  public loadHomework = this.loadFactory(
    fromHomework.LOAD,
    fromHomework.LOAD_SUCCESS,
    fromHomework.LOAD_FAIL,
    'HOMEWORK',
    ({ newData, oldData = { homework: [] } }) => ({
      ...newData,
      homework: newData.homework.map(item => {
        if (oldData.homework.find(el => item.lsn_id === el.lsn_id && el.checked)) {
          item.checked = true;
        }
        return item;
      })
    }),
  );

  @Effect({ dispatch: false })
  public persistLessonToggle = this.actions$
    .ofType(fromHomework.TOGGLE_LESSON)
    .pipe(switchMap(() => of(this.oldStore.persist())));
}
