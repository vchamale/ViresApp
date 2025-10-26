import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import IconMapper from './IconMapper';

type CalendarBoxProps = {
  onPress: () => void;
  selectedDate?: Date | null;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  iconName: string;
  iconSize?: number;
  iconColor: string;
  placeholderStyle?: StyleProp<TextStyle>;
  dateStyle?: StyleProp<TextStyle>;
};

const CalendarBox: React.FC<CalendarBoxProps> = ({
  onPress,
  selectedDate,
  placeholder = 'yyyy-mm-dd',
  containerStyle,
  iconName,
  iconSize = 20,
  iconColor = '#000',
  placeholderStyle,
  dateStyle,
}) => {
  const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : placeholder;

  return (
    <TouchableOpacity style={[styles.container]} onPress={onPress}>
      <Text
        style={[
          styles.text,
          ...(selectedDate
            ? [styles.selectedText, dateStyle].filter(Boolean)
            : [styles.placeholderText, placeholderStyle].filter(Boolean)),
        ]}
      >
        {formattedDate}
      </Text>
      <IconMapper iconName={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5db075',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  text: {
    width: '85%',
    fontSize: 16,
  },
  placeholderText: {
    color: '#5db07587',
    fontSize: 12,
  },
  selectedText: {
    color: '#5db075',
  },
});

export default CalendarBox;
