// R/RN
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, Pressable, FlatList } from 'react-native';
// Expo stuff
import { useRouter } from 'expo-router';
// API
import { useCreateShipmentMutation } from '@api/shipmentApi';
import { useGetAllDestinationsQuery } from '@api/destinationApi';
import { useGetAllOriginsQuery } from '@api/originApi';
import { useGetAllTrucksQuery } from '@api/truckApi';
// Components
import Space from '@components/Space';
import Dropdown from '@components/Dropdown';
import StepIndicator from '@components/StepIndicator';
import CustomHeader from '@components/CustomHeader';
import { useGetAllClientsQuery } from '@api/clientApi';

const CreateShipment = () => {
  // State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [driverId, setDriverId] = useState('');
  const [truckId, setTruckId] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // Vars
  const steps = ['Agregar Cliente', 'Ruta de Viaje', 'Detalle del Contenedor', 'Detalle del Transporte'];

  // hooks
  const router = useRouter();

  // API Calls

  // Querys
  const { currentData: destinations } = useGetAllDestinationsQuery({});
  const { currentData: origins } = useGetAllOriginsQuery({});
  const { currentData: trucks } = useGetAllTrucksQuery({});
  const { currentData: clients } = useGetAllClientsQuery({});

  // Mutations
  const [createShipment] = useCreateShipmentMutation();

  // Functions
  const handleCreateShipment = async () => {
    if (!origin || !destination || !driverId || !truckId || !price || !weight) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const newShipment = {
        origin_id: 1, //parseInt(origin),
        destination_id: 1, //parseInt(destination),
        tenant_id: 1,
        container_id: 1,
        driver_id: 2,
        truck_id: 1,   //parseInt(truckId),
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

  const handleStepPress = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={styles.container}>
        <CustomHeader 
          title={steps[currentStep]} 
          onBackPress={() => {
            router.back();
          }}
        />
        <Space vertical size={25} />
        <View style={{...styles.containerSteps }}>
          <StepIndicator steps={steps} currentStep={currentStep} onStepPress={handleStepPress} />
          <Text style={{ ...styles.currentStepText, color: '#000' }}>Current Step: {steps[currentStep]}</Text>
        </View>
        <Space vertical size={25} />
        <FlatList
          data={[{ key: 'form' }]}
          keyExtractor={(item) => item.key}
          renderItem={() => (
            <>
            <Text style={styles.label}>Cliente</Text>
            <Dropdown 
              items={clients}
              placeholder="Selecciona un cliente"
              renderItemText={(item) => `${item.name}`}
              onItemSelected={(item) => console.log('Elemento seleccionado:', item)}
              linkText="Agregar nuevo cliente"
              onLinkPress={() => console.log('Botón tipo link presionado')}
            />
            <Text style={styles.label}>Origen</Text>
            <Dropdown 
              items={origins}
              placeholder="Selecciona una origen"
              renderItemText={(item) => `${item.name}`}
              onItemSelected={(item) => console.log('Elemento seleccionado:', item)}
              linkText="Agregar nuevo origen"
              onLinkPress={() => console.log('Botón tipo link presionado')}
            />
            <Text style={styles.label}>Destino</Text>
            <Dropdown 
              items={destinations}
              placeholder="Selecciona una destino"
              renderItemText={(item) => `${item.address}`}
              onItemSelected={(item) => console.log('Elemento seleccionado:', item)}
              linkText="Agregar nuevo destino"
              onLinkPress={() => console.log('Botón tipo link presionado')}
            />
            <Text style={styles.label}>Trailer</Text>
            <Dropdown 
              items={trucks}
              placeholder="Selecciona una trailer"
              renderItemText={(item) => `${item.plate}`}
              onItemSelected={(item) => console.log('Elemento seleccionado:', item)}
              linkText="Agregar nuevo trailer"
              onLinkPress={() => console.log('Botón tipo link presionado')}
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
            </>
          )}
          />
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
  containerSteps: {
    height: 100,
    width: 1000,
  },
  currentStepText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  }
});

export default CreateShipment;
