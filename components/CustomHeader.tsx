import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type HeaderProps = {
  title: string;
  statusBar?: {
    barStyle: StatusBarStyle;
    backgroundColor: string;
  };
  color?: string;
  backgroundColor?: string;
  onBackPress?: () => void;
  onHelpPress?: () => void;
  onEditPress?: () => void;
  onChangeViewPress?: () => void;
  showBackButton?: boolean;
  showEditButton?: boolean;
  showHelpButton?: boolean;
  isSinglePage?: boolean;
  showChangeViewButton?: boolean;
};

const CustomHeader: React.FC<HeaderProps> = ({
  title,
  backgroundColor,
  color,
  statusBar,
  onBackPress,
  onHelpPress,
  onEditPress,
  onChangeViewPress,
  showBackButton = true,
  showHelpButton = false,
  showEditButton = false,
  showChangeViewButton = false,
  isSinglePage = false,
}) => {
  return (
    <SafeAreaView
      style={[
        styles.headerContainer,
        backgroundColor ? { backgroundColor: backgroundColor } : null,
      ]}
    >
      {statusBar && (
        <StatusBar barStyle={statusBar.barStyle} backgroundColor={statusBar.backgroundColor} />
      )}
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={color ?? '#71a780'} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, color ? { color } : null]}>{title}</Text>
      {showHelpButton && (
        <TouchableOpacity onPress={onHelpPress} style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={34} color={color ?? '#71a780'} />
        </TouchableOpacity>
      )}
      {showEditButton && (
        <TouchableOpacity onPress={onEditPress} style={styles.helpButton}>
          <Ionicons name="create-sharp" size={28} color={color ?? '#71a780'} />
        </TouchableOpacity>
      )}
      {showChangeViewButton && (
        <TouchableOpacity onPress={onChangeViewPress} style={styles.helpButton}>
          {isSinglePage ? (
            <MaterialIcons name="view-carousel" size={28} color={color ?? '#71a780'} />
          ) : (
            <MaterialIcons name="view-timeline" size={28} color={color ?? '#71a780'} />
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
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
    color: '#71a780',
    fontWeight: 'bold',
  },
});

export default CustomHeader;
