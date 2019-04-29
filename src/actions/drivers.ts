import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-root-toast";

import {
  SelectDriverAction,
  SetDriversListAction,
  SELECT_DRIVER,
  SET_DRIVERS_LIST
} from "./types";
import { Driver } from "./../../types/types";

import { ThunkResult } from "../../types/thunk";
import findIndex from "lodash/findIndex";

export const getDrivers = (): ThunkResult<
  SetDriversListAction
> => async dispatch => {
  const result = await AsyncStorage.getItem("drivers");
  const drivers: Driver[] = !!result ? JSON.parse(result) : [];
  dispatch({ type: SET_DRIVERS_LIST, drivers });
};

export const selectDriver = (driver: Driver): SelectDriverAction => {
  return { type: SELECT_DRIVER, driver };
};

export const addDriver = (
  driver: Driver
): ThunkResult<SetDriversListAction> => async (dispatch, getState) => {
  const { list } = getState().drivers;
  const index = findIndex(list, function(item) {
    return item.id == driver.id;
  });
  let exists = false;
  if (index >= 0) {
    exists = true;
    list[index] = driver;
  } else {
    list.push(driver);
  }
  const drivers = JSON.stringify(list);
  await AsyncStorage.setItem("drivers", drivers);
  Toast.show(
    exists ? "Водитель успешно отредактирован" : "Водитель успешно добавлен",
    {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM
    }
  );
  dispatch({ type: SET_DRIVERS_LIST, drivers: list });
};
