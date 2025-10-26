import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Text,
} from 'react-native';
import IconMapper from './IconMapper'; // Asegúrate de tener este componente en tu proyecto.

type SearchBoxProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  iconName: string;
  iconColor: string;
  iconSize?: number;
};

const SearchBox: React.FC<SearchBoxProps> = ({
  containerStyle,
  iconName,
  iconSize = 20,
  iconColor = '#000',
  ...textInputProps
}) => {
  return (
    <View style={[styles.container]}>
      <TextInput
        style={styles.input}
        {...textInputProps} // Pasa cualquier propiedad adicional a TextInput
      />
      <IconMapper iconName={iconName} size={iconSize} color={iconColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5db075',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  input: {
    // flex: 1,
    color: '#5db075',
    width: '92%',
    height: 45,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
});

export default SearchBox;
