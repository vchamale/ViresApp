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
import { useGetAllDriversQuery } from '@api/driverApi';
import { useSnackbar } from '@components/context/SnackbarContext';
import { useAppDispatch } from '@hooks/useRedux';
import { addTransportDetails } from '@slice/shipmentSlice';
import { DriverT } from '@types/Driver';
import { TruckT } from '@types/Truck';

const AddTransportDetails = () => {
  // State
  const [driver, setDriver] = useState<DriverT | null>(null);
  const [truck, setTruck] = useState<TruckT | null>(null);
  const [notes, setNotes] = useState<string>('');

  // Vars

  // hooks
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  // API Calls
    // Querys
    const { currentData: trucks } = useGetAllTrucksQuery({});
    const { currentData: drivers } = useGetAllDriversQuery({});

    // Mutations

  // Functions
  const handleSelectDriver = (driver: DriverT) => {
    setDriver(driver);
  }

  const handleSelectTruck = (truck: TruckT) => {
    setTruck(truck);
  }

  const handleContinueButton = async () => {
    if (!driver) {
      return showSnackbar({
        message: "Debes seleccionar un piloto para continuar.",
        color: "red",
        duration: 3000
      });
    }
    
    if (!truck) {
      return showSnackbar({
        message: "Debes seleccionar un vehiculo para continuar.",
        color: "red",
        duration: 3000
      });
    }

    dispatch(addTransportDetails({
      truck,
      driver,
      notes
    }));

    router.push('/shipments/create/save-shipment');
  };

  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={styles.container}>
        <CustomHeader 
          title={'Detalle del transporte'} 
          onBackPress={() => {
            router.back();
          }}
        />
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={[{ key: 'form' }]}
          keyExtractor={(item) => item.key}
          renderItem={() => (
            <>
            <Text style={styles.label}>Piloto</Text>
            <Dropdown 
              items={drivers}
              placeholder="Selecciona un Piloto"
              renderItemText={(item) => `${item.names} ${item.lastNames}`}
              onItemSelected={(item: DriverT) => handleSelectDriver(item)}
              linkText="Agregar nuevo piloto"
              onLinkPress={() => console.log('Botón tipo link presionado')}
            />
            <Text style={styles.label}>Trailer</Text>
            <Dropdown 
              items={trucks}
              placeholder="Selecciona una trailer"
              renderItemText={(item) => `${item.plate}`}
              onItemSelected={(item: TruckT) => handleSelectTruck(item)}
              linkText="Agregar nuevo trailer"
              onLinkPress={() => console.log('Botón tipo link presionado')}
            />
            <Text style={styles.label}>Notas</Text>
            <TextInput
              style={styles.input}
              value={notes}
              onChangeText={setNotes}
              placeholder="Agregar comentarios para el viaje."
            />
            </>
          )}
          />
        <Button title="Crear Viaje" onPress={handleContinueButton} />
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
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'center'
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

export default AddTransportDetails;
