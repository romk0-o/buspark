import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
  name: "a" | "b";
  value: string;
  onPress: () => void;
}

const RouteSelector: React.FC<Props> = ({ name, value, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.selectorContainer}>
        <Icon size={24} name={`alpha-${name}-box`} />
        <Text numberOfLines={1} style={styles.text}>
          {value.length > 0
            ? value
            : name === "a"
            ? "Город отправления"
            : "Город назначения"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RouteSelector;

const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Platform.OS === "android" ? 16 : 10,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    paddingLeft: 5,
    flex: 1
  }
});
