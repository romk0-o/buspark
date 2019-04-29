import React from "react";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import DriversList from "./Screens/Drivers/List";
import DriversAdd from "./Screens/Drivers/Add";
import BusesList from "./Screens/Buses/List";
import BusesAdd from "./Screens/Buses/Add";
import Routes from "./Screens/Routes/index";

const DriversNav = createStackNavigator({
  DriversList,
  DriversAdd
});

const BusesNav = createStackNavigator({
  BusesList,
  BusesAdd
});

const RoutesNav = createStackNavigator({
  Routes
});

const TabNavigator = createBottomTabNavigator(
  {
    Routes: {
      screen: RoutesNav,
      navigationOptions: {
        tabBarLabel: "Маршруты"
      }
    },
    DriversList: {
      screen: DriversNav,
      navigationOptions: {
        tabBarLabel: "Водители"
      }
    },
    BusesList: {
      screen: BusesNav,
      navigationOptions: {
        tabBarLabel: "Автобусы"
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;

        let iconName: string;

        switch (routeName) {
          case "BusesList":
            iconName = "bus";
            break;
          case "DriversList":
            iconName = "account-card-details";
            break;
          default:
            iconName = "map-marker-distance";
        }
        return (
          <Icon name={iconName} size={25} color={tintColor || undefined} />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    }
  }
);

const NavAppContainer = createAppContainer(TabNavigator);

export default NavAppContainer;
