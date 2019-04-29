import React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ListView,
  TextInputProps
} from "react-native";

interface Hint {
  name: string;
  value: string;
}

interface HintProps extends Hint {
  setValue: (value: string) => void;
}

interface Props {
  label?: string;
  isClearBtn?: boolean;
  backgroundColor?: string;
  hints?: Hint[];
  value?: string;
  getHints?: (query: string) => void;
  setValue?: (value: string) => void;
  setValueFromHints?: (value: string) => void;
  startWithHints?: boolean;
}

interface State {
  isHintSelect: boolean;
  focused: boolean;
}

class Input extends React.Component<Props & TextInputProps, State> {
  state = {
    isHintSelect: true,
    focused: false
  };

  hintsTimeout?: number;

  componentDidMount() {
    if (this.props.startWithHints) this.setState({ isHintSelect: false });
  }

  getHintsTimeout(value: string) {
    if (this.hintsTimeout) clearTimeout(this.hintsTimeout);
    if ((!!value && value.length > 2) || this.props.startWithHints) {
      this.hintsTimeout = setTimeout(() => {
        if (!!value && !!this.props.getHints) {
          !this.props.startWithHints && this.setState({ isHintSelect: false });
          this.props.getHints(value);
        }
      }, 500);
    }
  }

  setHint(value: string) {
    !this.props.startWithHints && this.setState({ isHintSelect: true });
    if (!!this.props.setValueFromHints) this.props.setValueFromHints(value);
  }

  render() {
    const {
      label,
      backgroundColor,
      hints,
      setValue,
      getHints,
      ...props
    } = this.props;

    return (
      <View style={styles.inputContainer}>
        {!!label && <Text style={styles.label}>{label}</Text>}
        <View>
          <TextInput
            style={[
              styles.input,
              !!backgroundColor && { backgroundColor },
              this.state.focused && { elevation: 2 }
            ]}
            underlineColorAndroid="transparent"
            onFocus={() => this.setState({ focused: true })}
            onChangeText={value => {
              if (!!setValue) setValue(value);
              this.getHintsTimeout(value);
            }}
            onSubmitEditing={() => {
              !this.props.startWithHints &&
                this.setState({ isHintSelect: true });
            }}
            onBlur={() => {
              !this.props.startWithHints &&
                this.setState({ isHintSelect: true, focused: false });
            }}
            {...props}
          />
          <TouchableOpacity
            onPress={() => !!setValue && setValue("")}
            style={styles.clearBtnContainer}
          >
            <View style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>×</Text>
            </View>
          </TouchableOpacity>
          {!this.state.isHintSelect && !!hints && hints.length > 0 && (
            <View style={styles.hintsContainer}>
              {!!hints &&
                hints.map((hint, index) => (
                  <HintItem
                    key={`hint--${hint.value}--${index}`}
                    {...hint}
                    setValue={value => this.setHint(value)}
                  />
                ))}
            </View>
          )}
        </View>
      </View>
    );
  }
}

const HintItem: React.FC<HintProps> = ({ value, name, setValue }) => {
  return (
    <TouchableOpacity onPress={() => setValue(value)}>
      <View style={styles.hintItem}>
        <Text>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10
  },
  label: {
    paddingLeft: 5,
    color: "#444",
    fontSize: 13
  },
  input: {
    backgroundColor: "#eee",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 40
  },
  clearBtnContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3
  },
  clearBtn: {
    flex: 1
  },
  clearBtnText: {
    fontSize: 28,
    color: "#aaa",
    textAlign: "center"
  },
  hintsContainer: {
    marginTop: 10,
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 5
  },
  hintItem: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee"
  }
});

export default Input;
