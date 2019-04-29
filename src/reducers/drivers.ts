import { Driver } from "../../types/types";
import {
  DriversActions,
  SELECT_DRIVER,
  SET_DRIVERS_LIST
} from "../actions/types";

export interface State {
  list: Driver[];
  selected?: Driver;
}

const initialState = {
  list: [],
  selected: undefined
};

export function DriversReducer(
  state: State = initialState,
  action: DriversActions
): State {
  switch (action.type) {
    case SELECT_DRIVER: {
      return { ...state, selected: action.driver };
    }
    case SET_DRIVERS_LIST: {
      return { ...state, list: action.drivers };
    }
    default:
      return state;
  }
}
