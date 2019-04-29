import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { State } from "../src/reducers";

type ThunkResult<A extends Action> = ThunkAction<void, State, void, A>;
