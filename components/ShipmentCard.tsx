import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IconMapper from '@components/IconMapper';
import Space from './Space';
import { statusMapper } from 'utils/common/statusMapper';
import AnimatedText from './AnimatedText';

type CardProps = {
  containerNumber: string;
  date: string;
  destination: string;
  status: string;
  onViewPress: () => void;
};

const ShipmentCard: React.FC<CardProps> = ({
  containerNumber,
  date,
  destination,
  status,
  onViewPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ alignContent: 'center', alignItems: 'center' }}>
          <IconMapper {...statusMapper[status]} size={24} />
          <Space vertical size={10} />
          <AnimatedText
            style={{ color: statusMapper[status].color, fontWeight: '900' }}
            size={40}
            textSize={85}
            fontSize={12}
            speed={20}
          >
            {status?.toUpperCase()}
          </AnimatedText>
        </View>
        <View style={styles.column}>
          <View style={styles.column}>
            <Text style={styles.label}>No. Contenedor</Text>
            <Space vertical size={5} />
            <Text style={styles.text}>{containerNumber}</Text>
          </View>
          <Space vertical size={10} />
          <View style={styles.destinationContainer}>
            <Text style={styles.label}>Destino</Text>
            <View style={styles.destinationRow}>
              <Text style={styles.text}>{destination}</Text>
            </View>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.column}>
            <Text style={styles.label}>Fecha</Text>
            <Space vertical size={5} />
            <Text style={styles.text}>{date}</Text>
          </View>
          <Space vertical size={10} />
          <View style={styles.rowButton}>
            <TouchableOpacity onPress={onViewPress} style={styles.viewButton}>
              <Text style={styles.viewButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShipmentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Sombra para Android
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  destinationRow: {
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: '700',
    color: '#71a780',
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  destinationContainer: {
    flex: 1,
  },
  viewButton: {
    backgroundColor: '#71a780',
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 15,
    marginLeft: 10,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
