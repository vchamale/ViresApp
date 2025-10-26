import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type ClientCardProps = {
  client: any;
  onViewPress: () => void;
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onViewPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.text}>{client?.name}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>NIT</Text>
          <Text style={styles.text}>{client?.nit}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Dirección</Text>
          <Text style={styles.text}>{client?.address}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.text}>{client?.email}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onViewPress} style={styles.viewButton}>
        <Text style={styles.viewButtonText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ClientCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontWeight: '700',
    color: '#71a780',
    fontSize: 14,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#71a780',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
