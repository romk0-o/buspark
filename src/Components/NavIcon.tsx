import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
  name: string;
  onPress?: () => void;
}

const NavIcon: React.FC<Props> = ({ name, onPress }) => {
  return (
    <View style={{ paddingRight: 10 }}>
      <TouchableOpacity onPress={() => !!onPress && onPress()}>
        <Icon name={name} size={36} />
      </TouchableOpacity>
    </View>
  );
};

export default NavIcon;
