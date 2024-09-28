import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useCreateShipmentMutation } from '@api/shipmentApi';
import { useRouter } from 'expo-router';
import Space from '@components/Space';

const CreateShipment = () => {
  // State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [driverId, setDriverId] = useState('');
  const [truckId, setTruckId] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  // hooks
  const router = useRouter();

  // API Calls
  const [createShipment] = useCreateShipmentMutation();

  const handleCreateShipment = async () => {
    if (!origin || !destination || !driverId || !truckId || !price || !weight) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const newShipment = {
        origin_id: parseInt(origin),
        destination_id: parseInt(destination),
        container_id: 1,
        driver_id: parseInt(driverId),
        truck_id: parseInt(truckId),
        price: parseFloat(price),
        weight: parseFloat(weight),
        notes,
        shipment_status_id: 1,
        status_updated: new Date()
      };

      await createShipment(newShipment).unwrap();
      Alert.alert('Success', 'Shipment created successfully!');
      router.back();
    } catch (error) {
      console.log('error ', error)
      Alert.alert('Error', 'Failed to create shipment.');
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={styles.container}>
        <Text style={{
          fontSize: 45,
          fontWeight: 'condensedBold'
        }}>Crear Viaje</Text>
        <Space vertical size={25} />
        <Pressable onPress={() => {
          router.back();
        }}>
          <Text style={{
            color: '#5db075',
            fontSize: 25
          }}>Atras</Text>
        </Pressable>
        <Space vertical size={25} />
        <ScrollView>

          <Text style={styles.label}>Origin ID</Text>
          <TextInput
            style={styles.input}
            value={origin}
            onChangeText={setOrigin}
            keyboardType="numeric"
            placeholder="Enter Origin ID"
          />

          <Text style={styles.label}>Destination ID</Text>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            keyboardType="numeric"
            placeholder="Enter Destination ID"
          />

          <Text style={styles.label}>Driver ID</Text>
          <TextInput
            style={styles.input}
            value={driverId}
            onChangeText={setDriverId}
            keyboardType="numeric"
            placeholder="Enter Driver ID"
          />

          <Text style={styles.label}>Truck ID</Text>
          <TextInput
            style={styles.input}
            value={truckId}
            onChangeText={setTruckId}
            keyboardType="numeric"
            placeholder="Enter Truck ID"
          />

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="Enter Price"
          />

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="Enter Weight"
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter any notes"
          />
        </ScrollView>
        <Button title="Create Shipment" onPress={handleCreateShipment} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default CreateShipment;
