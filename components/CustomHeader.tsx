import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
};

const CustomHeader: React.FC<HeaderProps> = ({ title, onBackPress, showBackButton = true }) => {
  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
