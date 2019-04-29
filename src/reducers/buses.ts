import { Bus } from "../../types/types";
import {
  BusActions,
  SELECT_BUS,
  SET_BUSES_LIST,
  ADD_BUS
} from "../actions/types";

export interface State {
  list: Bus[];
  selected?: Bus;
}

const initialState = {
  list: [],
  selected: undefined
};

export function BusesReducer(
  state: State = initialState,
  action: BusActions
): State {
  switch (action.type) {
    case SELECT_BUS: {
      return { ...state, selected: action.bus };
    }
    case SET_BUSES_LIST: {
      return { ...state, list: action.buses };
    }
    default:
      return state;
  }
}
