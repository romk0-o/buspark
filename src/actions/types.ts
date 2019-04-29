import { Bus, Driver } from "./../../types/types";

export const SET_BUSES_LIST = "SET_BUSES_LIST";
export const SELECT_BUS = "SELECT_BUS";
export const RESET_BUSES_LIST = "RESET_BUSES_LIST";
export const ADD_BUS = "ADD_BUS";

export interface SetBusesListAction {
  type: typeof SET_BUSES_LIST;
  buses: Bus[];
}

export interface SelectBusAction {
  type: typeof SELECT_BUS;
  bus: Bus;
}

export interface AddBusAction {
  type: typeof ADD_BUS;
  bus: Bus;
}

export type BusActions = SelectBusAction | SetBusesListAction;

export const SET_DRIVERS_LIST = "SET_DRIVERS_LIST";
export const SELECT_DRIVER = "SELECT_DRIVER";
export const RESET_DRIVERS_LIST = "RESET_DRIVERS_LIST";
export const ADD_DRIVER = "ADD_DRIVER";

export interface SetDriversListAction {
  type: typeof SET_DRIVERS_LIST;
  drivers: Driver[];
}

export interface SelectDriverAction {
  type: typeof SELECT_DRIVER;
  driver: Driver;
}

export interface AddDriverAction {
  type: typeof ADD_DRIVER;
  driver: Driver;
}

export type DriversActions = SelectDriverAction | SetDriversListAction;
