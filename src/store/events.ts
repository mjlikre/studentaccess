import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export const SET_SELECTED = '[Events] SET_SELECTED';
export const LOAD = '[Events] LOAD';
export const LOAD_SUCCESS = '[Events] LOAD_SUCCESS';
export const LOAD_FAIL = '[Events] LOAD_FAIL';

export interface EventsState {
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
  constructor(public payload: any[]){}
}
export class LoadFail implements Action {
  readonly type = LOAD_FAIL;
  constructor(public payload: Error){}
}

type All = SetSelected | Load | LoadSuccess | LoadFail;

export default function (state: EventsState = { selected: null, list: [] }, action: All) {
  switch (action.type) {
    case SET_SELECTED:
      return {
        ...state,
        selected: state.selected === action.payload ? null : action.payload,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        list: action.payload,
      };

    default:
      return state;
  }
}


export const getEvents = createFeatureSelector<EventsState>('events');
export const getEventsList = createSelector(
  getEvents,
  (events) => events.list,
);
export const getEventsLoaded = createSelector(
  getEventsList,
  (list) => !!list.length,
);
export const getSelected = createSelector(
  getEvents,
  (events) => events.selected,
);
