import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-root-toast";

import {
  SetBusesListAction,
  SelectBusAction,
  SET_BUSES_LIST,
  SELECT_BUS
} from "./types";
import { Bus } from "./../../types/types";

import { ThunkResult } from "../../types/thunk";

export const getBuses = (): ThunkResult<
  SetBusesListAction
> => async dispatch => {
  const result = await AsyncStorage.getItem("buses");
  const buses: Bus[] = !!result ? JSON.parse(result) : [];
  dispatch({ type: SET_BUSES_LIST, buses });
};

export const selectBus = (bus: Bus): SelectBusAction => {
  return { type: SELECT_BUS, bus };
};

export const addBus = (bus: Bus): ThunkResult<SetBusesListAction> => async (
  dispatch,
  getState
) => {
  const { list } = getState().buses;
  list.push(bus);
  const buses = JSON.stringify(list);
  await AsyncStorage.setItem("buses", buses);
  Toast.show("Автобус успешно добавлен", {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM
  });
  dispatch({ type: SET_BUSES_LIST, buses: list });
};
