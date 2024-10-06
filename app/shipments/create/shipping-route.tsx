// R/RN
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, FlatList } from 'react-native';
// Expo stuff
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// API
import { useGetAllDestinationsQuery } from '@api/destinationApi';
import { useGetAllOriginsQuery } from '@api/originApi';
// Components
import Dropdown from '@components/Dropdown';
import CustomHeader from '@components/CustomHeader';
import { useAppDispatch, useAppSelector } from '@hooks/useRedux';
import { addOrigin, addShipmentRoute, shipmentSelector } from '@slice/shipmentSlice';
import { useSnackbar } from '@components/context/SnackbarContext';
import { DestinationT, OriginT } from '@types/Shipment';

const ShippingRoute = () => {
  // State
  const [origin, setOrigin] = useState<OriginT | null>(null);
  const [destination, setDestination] = useState<DestinationT | null>(null);

  // Vars

  // Store 

  // hooks
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  // API Calls
    // Querys
    const { currentData: destinations } = useGetAllDestinationsQuery({});
    const { currentData: origins } = useGetAllOriginsQuery({});

    // Mutations

  // Functions
  const handleOriginSelected = (origin: OriginT) => {
    setOrigin(origin);
  }

  const handleDestinationSelected = (destination: DestinationT) => {
    setDestination(destination)
  }

  const handleContinueButton = () => {
    if (!origin) {
      return showSnackbar({
        message: "Debes seleccionar un origen para continuar.",
        color: "red",
        duration: 3000
      });
    }

    if (!destination) {
      return showSnackbar({
        message: "Debes seleccionar un destino para continuar.",
        color: "red",
        duration: 3000
      });
    }

    dispatch(addShipmentRoute({
      origin,
      destination
    }))

    router.push('/shipments/create/add-container-details')
  }

  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={styles.container}>
        <CustomHeader 
          title={'Ruta de viaje'} 
          onBackPress={() => {
            router.back();
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <FontAwesome6 name='route' size={100} color='#5db075' />
        </View>
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={[{ key: 'form' }]}
          keyExtractor={(item) => item.key}
          renderItem={() => (
            <>
            <Text style={styles.label}>Origen</Text>
            <Dropdown 
              items={origins}
              placeholder="Selecciona una origen"
              renderItemText={(item) => `${item.name}`}
              onItemSelected={(item: OriginT) => handleOriginSelected(item)}
              linkText="Agregar nuevo origen"
              onLinkPress={() => console.log('Botón tipo link presionado')}
            />
            <Text style={styles.label}>Destino</Text>
            <Dropdown 
              items={destinations}
              placeholder="Selecciona una destino"
              renderItemText={(item) => `${item.address}`}
              onItemSelected={(item: DestinationT) => handleDestinationSelected(item)}
              linkText="Agregar nuevo destino"
              onLinkPress={() => console.log('Botón tipo link presionado')}
            />
            </>
          )}
          />
        <Button title="Continuar" onPress={handleContinueButton} />
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

export default ShippingRoute;
