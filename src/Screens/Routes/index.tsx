import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  Button,
  Platform
} from "react-native";
import Input from "../../Components/Input";
import Page from "./../../Components/Page";
import PaddedContainer from "../../Components/PaddedContainer";
import {
  NavigationStackScreenOptions,
  NavigationScreenProps
} from "react-navigation";
import {
  CitySuggestionsResponse,
  CitySuggestion,
  Route,
  RouteResponse,
  Driver
} from "../../../types/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RouteSelector from "./../../Components/RouteSelector";
import { connect } from "react-redux";
import { State as GlobalState } from "./../../reducers/index";
import find from "lodash/find";
import { Bus } from "./../../../types/types";
import { getDrivers } from "./../../actions/drivers";
import { getBuses } from "./../../actions/buses";

interface State {
  routeFrom?: CitySuggestion;
  routeTo?: CitySuggestion;
  routeFromText: string;
  routeToText: string;
  hintsData: { [id: string]: CitySuggestion };
  modal: "a" | "b" | null;
  routeData?: Route;
}

interface ListItem {
  driver: Driver;
  buses: Bus[];
  minSpeed: number;
  time: string;
}

interface Props {
  getBuses: () => void;
  getDrivers: () => void;
}

const MAP_BOX_TOKEN: "pk.eyJ1Ijoicm9tYW5ibGVpayIsImEiOiJjanYwcm41cHQxNzRyM3ptMjBkaGViZXBsIn0.6kVpgkxsXpOPEE-E1xzgCg" =
  "pk.eyJ1Ijoicm9tYW5ibGVpayIsImEiOiJjanYwcm41cHQxNzRyM3ptMjBkaGViZXBsIn0.6kVpgkxsXpOPEE-E1xzgCg";

class Routes extends React.Component<
  NavigationScreenProps & GlobalState & Props,
  State
> {
  static navigationOptions: NavigationStackScreenOptions = {
    title: "Маршруты"
  };

  state: State = {
    routeFrom: undefined,
    routeTo: undefined,
    routeFromText: "",
    routeToText: "",
    hintsData: {},
    modal: null,
    routeData: undefined
  };

  componentDidMount() {
    this.props.getDrivers();
    this.props.getBuses();
  }

  getHint = async (query: string) => {
    try {
      const result = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAP_BOX_TOKEN}&cachebuster=1556447229690&autocomplete=true&types=place`
      );
      const body: CitySuggestionsResponse = await result.json();
      if (body.features) {
        const hintsData: { [id: string]: CitySuggestion } = {};
        body.features.forEach(value => {
          hintsData[value.id] = value;
        });
        this.setState({ hintsData });
      }
    } catch (e) {
      console.log(e);
    }
  };

  calcRoute = async () => {
    const { routeFrom, routeTo } = this.state;
    if (!!routeFrom && !!routeTo) {
      const [fromLong, fromLat] = routeFrom.center;
      const [toLong, toLat] = routeTo.center;
      const result = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLat},${fromLong};${toLat},${toLong}.json?access_token=${MAP_BOX_TOKEN}`
      );
      const data: RouteResponse = await result.json();
      this.setState({
        routeData: data.code === "Ok" ? data.routes[0] : undefined
      });
    }
  };

  getDriversList(distance: number) {
    const { drivers, buses } = this.props;
    const driversList = drivers.list.map(driver => {
      let selectedBuses: Bus[] = [];
      driver.buses.map(busId => {
        const bus: Bus | undefined = find(this.props.buses.list, [
          "id",
          Number(busId)
        ]);
        if (bus) {
          if (selectedBuses.length === 0) {
            selectedBuses = [bus];
          } else {
            if (selectedBuses[0].averageSpeed < bus.averageSpeed) {
              selectedBuses = [bus];
            } else if (selectedBuses[0].averageSpeed === bus.averageSpeed) {
              selectedBuses.push(bus);
            }
          }
        }
      });
      return {
        minSpeed: selectedBuses[0].averageSpeed,
        driver,
        buses: selectedBuses,
        time: (distance / (selectedBuses[0].averageSpeed / 3)).toFixed(1)
      };
    });

    return driversList.sort(function(a, b) {
      if (a.minSpeed < b.minSpeed) {
        return 1;
      }
      if (a.minSpeed > b.minSpeed) {
        return -1;
      }
      return 0;
    });
  }

  renderItem = ({ item }: { item: ListItem }) => {
    return (
      <PaddedContainer style={styles.card}>
        <View style={styles.cardItem}>
          <Icon name="account-box" size={24} />
          <Text style={styles.cardTitle}>
            {item.driver.fullName.toUpperCase()}
          </Text>
        </View>
        <View>
          {item.buses.map(({ model, averageSpeed, year }) => {
            return (
              <View style={styles.busCard}>
                <Text>
                  {model} ({year} г.){" "}
                </Text>
                <Text>
                  <Icon name="av-timer" /> {item.time}ч. со скоростью{" "}
                  {averageSpeed}
                  км/ч
                </Text>
              </View>
            );
          })}
        </View>
      </PaddedContainer>
    );
  };

  render() {
    const {
      hintsData,
      routeFromText,
      routeToText,
      modal,
      routeFrom,
      routeTo,
      routeData
    } = this.state;

    const hints = Object.keys(hintsData).map(value => ({
      name: hintsData[value].place_name,
      value
    }));

    const distance = routeData
      ? Math.floor(Math.ceil(routeData.distance) / 1000)
      : 0;

    const driversList = distance ? this.getDriversList(distance) : [];

    return (
      <Page noPadding>
        <View style={styles.routesInputs}>
          <View style={{ flex: 1, paddingTop: 10 }}>
            <RouteSelector
              value={routeFromText}
              onPress={() => this.setState({ modal: "a" })}
              name="a"
            />
            <RouteSelector
              value={routeToText}
              onPress={() => this.setState({ modal: "b" })}
              name="b"
            />
          </View>
          <View style={styles.changeRoutes}>
            <TouchableOpacity
              onPress={() => {
                if (!!routeFrom && !!routeTo) {
                  this.setState(
                    {
                      routeFrom: this.state.routeTo,
                      routeFromText: this.state.routeToText,
                      routeTo: this.state.routeFrom,
                      routeToText: this.state.routeFromText
                    },
                    () => this.calcRoute()
                  );
                }
              }}
            >
              <Icon size={48} name="menu-swap" />
            </TouchableOpacity>
          </View>
        </View>
        {distance > 0 && (
          <PaddedContainer style={styles.distance}>
            <Text style={styles.distanceText}>РАССТОЯНИЕ {distance} КМ</Text>
          </PaddedContainer>
        )}
        <FlatList
          data={driversList}
          contentContainerStyle={{ paddingTop: 10 }}
          keyExtractor={({ driver }) => `driver--${driver.id}`}
          renderItem={this.renderItem}
        />
        <Modal
          onRequestClose={() => this.setState({ modal: null })}
          visible={!!this.state.modal}
        >
          <PaddedContainer style={styles.modal}>
            <View style={styles.search}>
              <Input
                backgroundColor="white"
                label={modal === "a" ? "Город отправления" : "Город назначения"}
                isClearBtn={true}
                getHints={this.getHint}
                hints={hints}
                setValueFromHints={id => {
                  if (modal === "a") {
                    this.setState(
                      {
                        routeFromText: hintsData[id].place_name,
                        routeFrom: hintsData[id],
                        modal: null
                      },
                      () => this.calcRoute()
                    );
                  } else {
                    this.setState(
                      {
                        routeToText: hintsData[id].place_name,
                        routeTo: hintsData[id],
                        modal: null
                      },
                      () => this.calcRoute()
                    );
                  }
                }}
              />
            </View>
            <Button
              title="Закрыть"
              onPress={() => this.setState({ modal: null })}
            />
          </PaddedContainer>
        </Modal>
      </Page>
    );
  }
}

export default connect(
  ({ drivers, buses }: GlobalState) => ({
    drivers,
    buses
  }),
  { getBuses, getDrivers }
)(Routes);

const styles = StyleSheet.create({
  routesInputs: {
    backgroundColor: "#eee",
    flexDirection: "row"
  },
  modal: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#eee"
  },
  search: {
    flex: 1
  },
  changeRoutes: {
    alignSelf: "center"
  },
  distance: {
    backgroundColor: "#999"
  },
  distanceText: {
    fontSize: 16,
    color: "white"
  },
  card: {
    backgroundColor: "#eee",
    marginHorizontal: Platform.OS === "android" ? 16 : 10,
    marginBottom: 10,
    borderRadius: 5,
    justifyContent: "space-between"
  },
  cardTitle: {
    fontSize: 16,
    marginLeft: 4
  },
  cardItem: {
    flexDirection: "row"
  },
  busCard: {
    marginTop: 5,
    backgroundColor: "white",
    padding: 5
  }
});
