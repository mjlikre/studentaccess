import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export const SET_SELECTED = 'SET_SELECTED';

export interface EventsState {
  selected: string;
}

type SetSelected = Action & {
  id: string;
}

type All = SetSelected;

export default function (state: EventsState = { selected: null }, action: All) {
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
export const getSelected = createSelector(
  getEvents,
  (events: EventsState) => events.selected,
);
