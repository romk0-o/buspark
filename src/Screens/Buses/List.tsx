import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import { connect } from "react-redux";
import {
  NavigationStackScreenOptions,
  NavigationScreenProps,
  NavigationScreenProp,
  NavigationRoute,
  FlatList
} from "react-navigation";

import { State } from "../../reducers";

import { getBuses, selectBus, addBus } from "./../../actions/buses";
import { Bus } from "./../../../types/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavIcon from "../../Components/NavIcon";
import PaddedContainer from "../../Components/PaddedContainer";

interface Props {
  getBuses: () => void;
  addBus: (driver: Bus) => void;
  selectBus: (driver: Bus) => void;
  list: Bus[];
}
class List extends React.Component<NavigationScreenProps & Props> {
  static navigationOptions = ({
    navigation
  }: {
    navigation: NavigationScreenProp<NavigationRoute>;
  }): NavigationStackScreenOptions => {
    return {
      title: "Автобусы",
      headerRight: (
        <NavIcon
          onPress={() => navigation.navigate({ routeName: "BusesAdd" })}
          name="plus-box"
        />
      )
    };
  };

  componentDidMount() {
    this.props.getBuses();
  }

  renderItem = ({ item }: { item: Bus }) => {
    return (
      <PaddedContainer style={styles.card}>
        <View style={styles.cardItem}>
          <Icon name="bus" size={24} />
          <Text style={styles.cardTitle}>{item.model.toUpperCase()}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.cardTitle}>{item.averageSpeed} км/ч |</Text>
          <Text style={styles.cardTitle}>{item.year} г.</Text>
        </View>
      </PaddedContainer>
    );
  };

  render() {
    const { list: buses } = this.props;
    return (
      <View>
        <FlatList
          keyExtractor={item => `bus--${item.id}`}
          data={buses}
          renderItem={this.renderItem}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      </View>
    );
  }
}

const BusesList = connect(
  ({ buses }: State) => ({ ...buses }),
  {
    getBuses,
    selectBus,
    addBus
  }
)(List);

export default BusesList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eee",
    marginHorizontal: Platform.OS === "android" ? 16 : 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
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
