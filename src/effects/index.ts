import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

@Injectable()
export default class {
  constructor(private actions$: Actions) { }
  @Effect() load = this.actions$.ofType('LOAD');
}
