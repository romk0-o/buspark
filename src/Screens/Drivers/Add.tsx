import React from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
  StackActions,
  NavigationActions
} from "react-navigation";
import DatePicker from "react-native-datepicker";
import format from "date-fns/format";
import find from "lodash/find";

import Input from "./../../Components/Input";
import { Driver } from "./../../../types/types";
import { State as GlobalState } from "./../../reducers/index";
import { addDriver } from "./../../actions/drivers";
import PaddedContainer from "../../Components/PaddedContainer";
import Page from "./../../Components/Page";
import Button from "./../../Components/Button";
import dateParse from "./../../utils/dateParse";
import { State as BusesState } from "./../../reducers/buses";
import { getBuses } from "./../../actions/buses";
import { State as DriversState } from "./../../reducers/drivers";

interface State {
  id?: number;
  fullName: string;
  birthday: string;
  buses: string[];
  busesInput: string;
}

interface Props {
  buses: BusesState;
  drivers: DriversState;
  getBuses: () => void;
  addDriver: (driver: Driver) => void;
}

class Add extends React.Component<NavigationScreenProps & Props, State> {
  static navigationOptions: NavigationStackScreenOptions = {
    title: "Редактор водителей"
  };

  state = {
    fullName: "",
    birthday: "",
    id: undefined,
    buses: [],
    busesInput: ""
  };

  componentDidMount() {
    this.props.getBuses();
    const driver: Driver = this.props.navigation.getParam("driver");
    if (driver) {
      this.setState({ ...driver });
    }
  }

  submitHandler = () => {
    const { fullName, birthday, id } = this.state;
    const buses: string[] = this.state.buses;
    if (buses.length > 0 && fullName.length > 1 && birthday.length > 0) {
      this.props.addDriver({
        fullName,
        birthday,
        buses,
        id: id || this.props.drivers.list.length
      });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "DriversList" })]
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      Alert.alert(
        "Пожалуйста, проверьте заполнение полей",
        "Все поля обязательны для заполнения"
      );
    }
  };

  render() {
    const { fullName, birthday, busesInput } = this.state;
    const buses: string[] = this.state.buses;

    let hints = this.props.buses.list.map(({ id, model, year }) => {
      return {
        value: String(id),
        name: `${model} (${year} г.)`
      };
    });

    hints = hints.filter(({ name, value }) => {
      if (
        name.indexOf(this.state.busesInput) >= 0 &&
        buses.indexOf(value) < 0
      ) {
        return true;
      }
      return false;
    });

    return (
      <Page noPadding>
        <ScrollView style={{ flex: 1 }}>
          <PaddedContainer>
            <Input
              label="ФИО"
              value={fullName}
              setValue={fullName => this.setState({ fullName })}
              placeholder="Блейк Роман Сергеевич"
            />
            <Text style={styles.label}>Дата рождения</Text>
            <DatePicker
              date={birthday.length > 0 ? dateParse(birthday) : undefined}
              mode="date"
              maxDate={new Date()}
              confirmBtnText="ОК"
              cancelBtnText="Отмена"
              style={{ width: "100%", marginBottom: 10 }}
              placeholder="Выберите дату"
              format="DD/MM/YYYY"
              customStyles={{
                dateIcon: {
                  display: "none"
                },
                dateInput: styles.dateInput
              }}
              onDateChange={date =>
                this.setState({ birthday: format(date, "DD/MM/YYYY") })
              }
            />
            <View style={styles.busTags}>
              {buses.map(id => {
                let bus = find(this.props.buses.list, ["id", Number(id)]);
                if (bus instanceof Array) bus = bus[0];
                return !!bus ? (
                  <View key={`buskey--${bus.id}`}>
                    <TouchableOpacity
                      onPress={() => {
                        if (bus) {
                          const index = buses.indexOf(String(bus.id));
                          if (index >= 0) {
                            const newArr = buses.slice();
                            newArr.splice(index, 1);
                            this.setState({ buses: newArr });
                          }
                        }
                      }}
                    >
                      <View style={styles.busTag}>
                        <Text>
                          {bus.model} - {bus.year}г
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null;
              })}
            </View>
            <Input
              label="Автобусы"
              value={busesInput}
              setValue={busesInput => this.setState({ busesInput })}
              startWithHints={true}
              hints={hints}
              setValueFromHints={value => {
                const buses: string[] = this.state.buses;
                buses.push(value);
                this.setState({ busesInput: "", buses });
              }}
            />
          </PaddedContainer>
        </ScrollView>
        <Button onPress={this.submitHandler} title="Сохранить" />
      </Page>
    );
  }
}

const DriversAdd = connect(
  ({ buses, drivers }: GlobalState) => ({ buses, drivers }),
  { addDriver, getBuses }
)(Add);

export default DriversAdd;

const styles = StyleSheet.create({
  label: {
    paddingLeft: 5,
    color: "#444",
    fontSize: 13
  },
  dateInput: {
    width: "100%",
    borderRadius: 5,
    height: 40,
    borderWidth: 0,
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    alignItems: "flex-start"
  },
  busTags: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  busTag: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 5
  }
});
