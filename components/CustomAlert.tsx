import React, { ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  titleColor?: string;
  text: string;
  textColor?: string;
  buttons?: ReactNode[];
  isLoading?: boolean;
  closeButton?: boolean;
  alignText?: "left" | "center" | "right";
};

const CustomAlert: React.FC<Props> = ({
  isVisible,
  onClose,
  title,
  titleColor,
  text,
  textColor,
  buttons = [],
  isLoading = false,
  closeButton = true,
  alignText = "left",
}) => {
  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, titleColor ? { color: titleColor } : null]}>{title}</Text>
            {closeButton && (
              <Pressable onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="window-close" size={24} color="#3f51b5" />
              </Pressable>
            )}
          </View>
          <Text style={[styles.text, { textAlign: alignText }, textColor ? { color: textColor } : null]}>{text}</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#254073" style={styles.loader} />
          ) : (
            <View style={styles.buttonContainer}>
              {buttons.length > 0 ? (
                buttons.map((button, index) => (
                  <View key={`button-${index}`} style={styles.buttonWrapper}>
                    {button}
                  </View>
                ))
              ) : (
                <Pressable onPress={onClose} style={styles.defaultButton}>
                  <Text style={styles.defaultButtonText}>Aceptar</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: "90%",
    backgroundColor: "#e5ecf7",
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: "#71a780",
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: "#294476",
  },
  text: {
    fontSize: 15,
    color: "#445d88",
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    marginHorizontal: 5
  },
  defaultButton: {
    backgroundColor: "#71a780",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 4,
    marginTop: 20,
  },
  defaultButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
