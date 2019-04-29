import { combineReducers, Reducer } from "redux";
import { BusesReducer, State as BusesState } from "./buses";
import { DriversReducer, State as DriversState } from "./drivers";

export interface State {
  buses: BusesState;
  drivers: DriversState;
}

const reducer: Reducer<State> = combineReducers({
  buses: BusesReducer,
  drivers: DriversReducer
});

export default reducer;
