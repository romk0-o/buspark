import React from "react";
import { connect } from "react-redux";
import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
  NavigationActions,
  StackActions
} from "react-navigation";

import Input from "./../../Components/Input";
import { State as GlobalState } from "./../../reducers/index";
import PaddedContainer from "../../Components/PaddedContainer";
import Page from "./../../Components/Page";
import Button from "./../../Components/Button";
import { addBus } from "./../../actions/buses";
import { Bus } from "./../../../types/types";

interface Props {
  addBus: (bus: Bus) => void;
  list: Bus[];
}

interface State {
  id?: number;
  model: string;
  averageSpeed?: number;
  year?: number;
}

class Add extends React.Component<NavigationScreenProps & Props, State> {
  static navigationOptions: NavigationStackScreenOptions = {
    title: "Редактор автобусов"
  };

  state = {
    id: undefined,
    model: "",
    averageSpeed: undefined,
    year: undefined
  };

  componentDidMount() {
    console.log(this.props);
  }

  submitHandler = () => {
    const { model, averageSpeed, year, id } = this.state;
    if (
      model.length > 0 &&
      averageSpeed &&
      String(averageSpeed).length > 0 &&
      year &&
      String(year).length > 0
    ) {
      this.props.addBus({
        model,
        averageSpeed: Number(averageSpeed),
        year: Number(year),
        id: id || this.props.list.length
      });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "BusesList" })]
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
    const { model, averageSpeed, year } = this.state;

    return (
      <Page noPadding>
        <ScrollView style={{ flex: 1 }}>
          <PaddedContainer>
            <Input
              label="Модель"
              value={model}
              setValue={model => this.setState({ model })}
              placeholder="Yutong T122 HDH"
            />
            <Input
              label="Средняя скорость"
              placeholder="90"
              value={averageSpeed ? String(averageSpeed) : ""}
              setValue={averageSpeed => {
                averageSpeed = averageSpeed.replace(/[^\d]/g, "");
                this.setState({ averageSpeed: parseInt(averageSpeed) });
              }}
              keyboardType="numeric"
            />
            <Input
              label="Год выпуска"
              placeholder="2018"
              value={year ? String(year) : ""}
              setValue={year => {
                year = year.replace(/[^\d]/g, "");
                this.setState({
                  year:
                    parseInt(year) > new Date().getFullYear()
                      ? new Date().getFullYear()
                      : parseInt(year)
                });
              }}
              keyboardType="numeric"
            />
          </PaddedContainer>
        </ScrollView>
        <Button onPress={this.submitHandler} title="Сохранить" />
      </Page>
    );
  }
}

const BusesAdd = connect(
  ({ buses }: GlobalState) => ({ ...buses }),
  { addBus }
)(Add);

export default BusesAdd;
