import React from "react";
import {
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from "react-native";

interface Props {
  noPadding?: boolean;
  style?: ViewStyle;
}

const Page: React.FC<Props> = ({ noPadding, children, style }) => {
  return (
    <View style={[styles.page, noPadding && { padding: 0 }, !!style && style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: Platform.OS === "android" ? 16 : 10,
    flex: 1
  }
});

export default Page;
