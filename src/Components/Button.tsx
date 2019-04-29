import React from "react";
import {
  ViewStyle,
  TouchableOpacity,
  Text,
  View,
  StyleSheet
} from "react-native";

interface Props {
  title: String;
  onPress: () => void;
  containerStyle?: ViewStyle;
  color?: string;
  backgroundColor?: string;
}

const Button: React.FC<Props> = ({
  title,
  onPress,
  containerStyle,
  color,
  backgroundColor
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.containerStyle, !!containerStyle && containerStyle]}
    >
      <View style={[styles.button, !!backgroundColor && { backgroundColor }]}>
        <Text style={[styles.text, !!color && { color }]}>
          {title.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  containerStyle: {},
  button: {
    backgroundColor: "gray",
    height: 40,
    justifyContent: "center"
  },
  text: {
    fontSize: 18,
    color: "white",
    textAlign: "center"
  }
});
