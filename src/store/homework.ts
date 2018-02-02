import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export const TOGGLE_HIDE_CHECKED = '[Homework] TOGGLE_HIDE_CHECKED';
export class ToggleHideChecked implements Action {
  readonly type = TOGGLE_HIDE_CHECKED;
  constructor(public payload: boolean) { }
}

export const SET_SELECTED_CLASS = '[Homework] SET_SELECTED_CLASS';
export class SetSelectedClass implements Action {
  readonly type = SET_SELECTED_CLASS;
  constructor(public payload: string) { }
}
export const TOGGLE_LESSON = '[Homework] TOGGLE_LESSON';
export class ToggleLesson implements Action {
  readonly type = TOGGLE_LESSON;
  constructor(public payload: Lesson) { }
}

export const LOAD = '[Homework] LOAD';
export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: boolean = false) { }
}

export const LOAD_SUCCESS = '[Homework] LOAD_SUCCESS';
export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: {
    homework: Lesson[];
  }) { }
}

export const LOAD_FAIL = '[Homework] LOAD_FAIL';
export class LoadFail implements Action {
  readonly type = LOAD_FAIL;
  constructor(public payload: Error) { }
}

type All = Load | LoadSuccess | LoadFail | ToggleHideChecked | SetSelectedClass | ToggleLesson;
export interface Lesson {
  lsn_id: string;
  lsn_date: string;
  lsn_hw: string;
  calc_class: string;
  calc_date: string;
  checked?: boolean;
}
export interface HomeworkState {
  list: Array<Lesson>;
  hideChecked: boolean;
  selectedClass: string;
}
const initState: HomeworkState = { list: [], hideChecked: true, selectedClass: null };
export function homeworkReducer(state: HomeworkState = initState, action: All) {
  switch (action.type) {
    case LOAD_SUCCESS:
      return {
        ...state,
        list: action.payload.homework,
      };

    case TOGGLE_HIDE_CHECKED:
      return {
        ...state,
        hideChecked: action.payload,
      };
    case SET_SELECTED_CLASS:
      return {
        ...state,
        selectedClass: action.payload,
      };
    case TOGGLE_LESSON:
      return {
        ...state,
        list: state.list.map(item => item.lsn_id === action.payload.lsn_id
          ? { ...item, checked: !item.checked }
          : item
        ),
      };
    default:
      return state;
  }
}

export const getHomework = createFeatureSelector<HomeworkState>('homework');
export const getSelectedClass = createSelector(
  getHomework,
  (state) => state.selectedClass,
);
export const getAllHomework = createSelector(
  getHomework,
  (state) => state.list.slice(0).reverse(),
);
export const getHomeworkList = createSelector(
  getAllHomework,
  getSelectedClass,
  (list, selected) => selected
    ? list.filter(item => item.calc_class === selected)
    : list,
);
export const getLoaded = createSelector(
  getHomeworkList,
  (list) => !!list.length,
);
export const getHideChecked = createSelector(
  getHomework,
  (state) => state.hideChecked,
);
export const getClassList = createSelector(
  getAllHomework,
  (state) => state.map(item => item.calc_class).filter((item, i, arr) => arr.indexOf(item) === i),
);
