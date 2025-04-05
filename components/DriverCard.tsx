import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Space from "./Space";
import { format } from 'date-fns';

type DriverCardProps = {
  driver: any;
  onViewPress: () => void;
};

const DriverCard: React.FC<DriverCardProps> = ({ driver, onViewPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.text}>{`${driver?.names} ${driver?.lastNames}`}</Text>
          <Space vertical size={10} />
          <Text style={styles.label}>Licencia</Text>
          <Text style={styles.text}>{driver?.license}</Text>
        </View>
        <TouchableOpacity onPress={onViewPress} style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Ver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DriverCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Sombra para Android
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  label: {
    fontWeight: "700",
    color: "#71a780",
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: "#71a780",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
