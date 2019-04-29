import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import { State } from "../../reducers";
import { Driver } from "../../../types/types";

import { getDrivers, addDriver, selectDriver } from "./../../actions/drivers";
import { State as DriversState } from "./../../reducers/drivers";
import PaddedContainer from "../../Components/PaddedContainer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationStackScreenOptions,
  NavigationScreenProps
} from "react-navigation";
import NavIcon from "../../Components/NavIcon";

interface Props {
  getDrivers: () => void;
  addDriver: (driver: Driver) => void;
  selectDriver: (driver: Driver) => void;
  drivers: DriversState;
}

class List extends React.Component<Props & NavigationScreenProps> {
  static navigationOptions = ({
    navigation
  }: {
    navigation: NavigationScreenProp<NavigationRoute>;
  }): NavigationStackScreenOptions => {
    return {
      title: "Водители",
      headerRight: (
        <NavIcon
          onPress={() => navigation.navigate({ routeName: "DriversAdd" })}
          name="plus-box"
        />
      )
    };
  };

  componentDidMount() {
    this.props.getDrivers();
  }

  renderItem = ({ item }: { item: Driver }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate({
            routeName: "DriversAdd",
            params: { driver: item }
          });
        }}
      >
        <PaddedContainer style={styles.card}>
          <View style={styles.cardItem}>
            <Icon name="account-box" size={24} />
            <Text style={styles.cardTitle}>{item.fullName.toUpperCase()}</Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.cardTitle}>Автобусов: {item.buses.length}</Text>
            <Text style={styles.cardTitle}>{item.birthday}</Text>
          </View>
        </PaddedContainer>
      </TouchableOpacity>
    );
  };

  render() {
    const { drivers } = this.props;

    return (
      <View>
        <FlatList
          keyExtractor={item => `driver--${item.id}`}
          data={drivers.list}
          renderItem={this.renderItem}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      </View>
    );
  }
}

const DriversList = connect(
  ({ drivers }: State) => ({
    drivers
  }),
  {
    getDrivers,
    selectDriver,
    addDriver
  }
)(List);

export default DriversList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eee",
    marginHorizontal: Platform.OS === "android" ? 16 : 10,
    marginBottom: 10,
    borderRadius: 5,
    // flexDirection: "row",
    justifyContent: "space-between"
  },
  cardTitle: {
    fontSize: 16,
    marginLeft: 4
  },
  cardItem: {
    flexDirection: "row"
  }
});
