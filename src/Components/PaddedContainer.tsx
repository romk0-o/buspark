import React from "react";
import { View, StyleSheet, Platform, ViewStyle } from "react-native";

interface Props {
  style?: ViewStyle;
}

const PaddedContainer: React.FC<Props> = ({ style, children, ...props }) => {
  return (
    <View style={[styles.paddedContainer, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  paddedContainer: {
    padding: Platform.OS === "android" ? 16 : 10,
    overflow: "visible"
  }
});

export default PaddedContainer;
