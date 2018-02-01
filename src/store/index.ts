import { createSelector, createFeatureSelector, Action } from '@ngrx/store';

export const SET_TODAY = '[Root] SET_TODAY';

export interface RootState {
  today: string;
}

export class SetToday implements Action {
  readonly type = SET_TODAY;
  constructor(public payload: string){}
}

type All = SetToday;

export function rootReducer(state: RootState, action: All) {
  switch (action.type) {
    case SET_TODAY:
      return {
        ...state,
        today: action.payload,
      };

    default:
      return state;
  }
}

export const getRoot = createFeatureSelector('root');
export const getToday = createSelector(getRoot, (root: RootState) => root.today);
