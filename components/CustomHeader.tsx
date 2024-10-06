import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  onHelpPress?: () => void;
  showBackButton?: boolean;
  showHelpButton?: boolean;
};

const CustomHeader: React.FC<HeaderProps> = ({ title, onBackPress, onHelpPress, showBackButton = true, showHelpButton = false }) => {
  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5db075" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {showHelpButton && (
        <TouchableOpacity onPress={onHelpPress} style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={34} color="#5db075" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 5,
  },
  helpButton: {
    position: 'absolute',
    right: 5,
  },
  title: {
    fontSize: 18,
    color: '#5db075',
    fontWeight: 'bold',
  },
});

export default CustomHeader;
