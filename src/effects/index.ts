import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/Observable/of';

import { Store as OldStore } from '../providers/store';

@Injectable()
export default class {
  constructor(private actions$: Actions, private oldStore: OldStore) { }

  @Effect() load = this.actions$.ofType('LOAD').pipe(
    switchMap((action: any) => {
      return of(this.oldStore.get(action.payload))
    })
  );
}
