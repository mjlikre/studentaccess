import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export const SET_SELECTED = 'SET_SELECTED';

export interface EventsState {
  selected: string;
  list: any[];
}

type SetSelected = Action & {
  id: string;
}

type All = SetSelected;

export default function (state: EventsState = { selected: null, list: [] }, action: All) {
  switch (action.type) {
    case SET_SELECTED:
      return {
        ...state,
        selected: state.selected === action.id ? null : action.id,
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
export const getSelected = createSelector(
  getEvents,
  (events) => events.selected,
);
