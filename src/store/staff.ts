import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export const SET_SELECTED = '[Staff] SET_SELECTED';
export class SetSelected implements Action {
  readonly type = SET_SELECTED;
  constructor(public payload: string) { }
}
export const LOAD = '[Staff] LOAD';
export class Load implements Action {
  readonly type = LOAD;
}
export const LOAD_SUCCESS = '[Staff] LOAD_SUCCESS';
export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: {
    staff_list: any[];
  }) { }
}
export const LOAD_FAIL = '[Staff] LOAD_FAIL';
export class LoadFail implements Action {
  readonly type = LOAD_FAIL;
  constructor(public payload: Error) { }
}
export const TOGGLE_SEARCH = '[Staff] TOGGLE_SEARCH';
export class ToggleSearch implements Action {
  readonly type = TOGGLE_SEARCH;
}
export const SET_SEARCH_QUERY = '[Staff] SET_SEARCH_QUERY';
export class SetSearchQuery implements Action {
  readonly type = SET_SEARCH_QUERY;
  constructor(public payload: string) { }
}

type All = SetSelected | Load | LoadSuccess | LoadFail | ToggleSearch | SetSearchQuery;

export interface StaffState {
  selected: string | null;
  list: Array<{
    calc_name: string;
    calc_status: string;
  }>;
  showSearch: boolean;
  searchQuery: string;
}
const initialState = { selected: null, list: [], showSearch: false, searchQuery: '' };
export default function (state: StaffState = initialState, action: All) {
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
    case TOGGLE_SEARCH: {
      const showSearch = !state.showSearch;
      let searchQuery = state.searchQuery;
      if (showSearch === false) {
        searchQuery = '';
      }
      return {
        ...state,
        showSearch,
        searchQuery,
      };
    }
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload.toLowerCase().trim(),
      };

    default:
      return state;
  }
}

export const getStaff = createFeatureSelector<StaffState>('staff');
export const getList = createSelector(
  getStaff,
  (state) => state.list,
);
export const getSearchQuery = createSelector(
  getStaff,
  (state) => state.searchQuery,
);
export const getFilteredList = createSelector(
  getList,
  getSearchQuery,
  (list, query) => query ? list.filter(staff =>
    staff.calc_name.toLowerCase().includes(query) ||
    staff.calc_status.toLowerCase().includes(query)
  ) : list,
);
export const getLoaded = createSelector(
  getList,
  (list) => !!list.length,
);
export const getSelected = createSelector(
  getStaff,
  (state) => state.selected,
);
export const getShowSearch = createSelector(
  getStaff,
  (state) => state.showSearch,
);
