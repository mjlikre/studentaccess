import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export const SET_SELECTED = '[Staff] SET_SELECTED';
export const LOAD = '[Staff] LOAD';
export const LOAD_SUCCESS = '[Staff] LOAD_SUCCESS';
export const LOAD_FAIL = '[Staff] LOAD_FAIL';

export interface StaffState {
  selected: string | null;
  list: any[];
}

export class SetSelected implements Action {
  readonly type = SET_SELECTED;
  constructor(public payload: string){}
}
export class Load implements Action {
  readonly type = LOAD;
}
export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: {
    staff_list: any[];
  }){}
}
export class LoadFail implements Action {
  readonly type = LOAD_FAIL;
  constructor(public payload: Error){}
}

type All = SetSelected | Load | LoadSuccess | LoadFail;

export default function (state: StaffState = { selected: null, list: [] }, action: All) {
  switch (action.type) {
    case SET_SELECTED:
      return {
        ...state,
        selected: state.selected === action.payload ? null : action.payload,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        list: action.payload.staff_list,
      };

    default:
      return state;
  }
}


export const getEvents = createFeatureSelector<StaffState>('staff');
export const getList = createSelector(
  getEvents,
  (events) => events.list,
);
export const getLoaded = createSelector(
  getList,
  (list) => !!list.length,
);
export const getSelected = createSelector(
  getEvents,
  (events) => events.selected,
);
