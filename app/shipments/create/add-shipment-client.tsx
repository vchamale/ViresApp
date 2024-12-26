// R/RN
import React, { useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Text } from 'react-native';
// Expo stuff
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// API
import { useGetAllClientsQuery } from '@api/clientApi';
// Components
import Dropdown from '@components/Dropdown';
import CustomHeader from '@components/CustomHeader';
import { useAppDispatch } from '@hooks/useRedux';
import { addClient } from '@slice/shipmentSlice';
import { ClientT } from '@types/Shipment';
import { useSnackbar } from '@components/context/SnackbarContext';
import BackgroundView from '@components/BackgroundView';
import Space from '@components/Space';

const AddShipmentClient = () => {
  // State
  const [client, setClient] = useState<ClientT | null>(null);
  // Vars

  // Store
  const dispatch = useAppDispatch();

  // hooks
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  // Store

  // API Calls
    // Querys
    const { currentData: clients } = useGetAllClientsQuery({});
  ///////

  // Functions
  const handleClientSelected = (item: any) => {
    setClient(item);
  }

  const handleContinueButton = () => {
    if (!client) {
      return showSnackbar({
        message: "Debes seleccionar un cliente para continuear.",
        color: "red",
        duration: 3000
      });
    }
    
    dispatch(addClient(client));
    router.push('/shipments/create/shipping-route')
  }

  // Computations

  return (
    <BackgroundView>
      <SafeAreaView style={{
        flex: 1
      }}>
        <View style={styles.container}>
          <CustomHeader 
            title={'Agrega Cliente'}
            backgroundColor='#71a780'
            color='#fff'
            onBackPress={() => {
              router.back();
            }}
          />
          <Space vertical size={50} />
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <FontAwesome6 name='user-group' size={100} color='#fff' />
            </View>
            <Space vertical size={80} />
            <View style={{
              backgroundColor: '#71a780',
              marginHorizontal: 20,
              padding: 20,
              borderRadius: 20,
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}>
              <FlatList
                contentContainerStyle={styles.flatListContainer}
                data={[{ key: 'form' }]}
                keyExtractor={(item) => item.key}
                renderItem={() => (
                  <>
                  <Dropdown 
                    items={clients}
                    placeholder="Selecciona un cliente"
                    placeholderColor='#71a780'
                    renderItemText={(item) => `${item.name}`}
                    onItemSelected={(item) => handleClientSelected(item)}
                    linkText="Agregar nuevo cliente"
                    onLinkPress={() => console.log('Botón tipo link presionado')}
                  />
                  </>
                  )}
                />
            </View>
            <TouchableOpacity style={styles.createButton} onPress={handleContinueButton}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  flatListContainer: {
    flexGrow: 1
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
  },
  createButton: {
    marginHorizontal: 50,
    backgroundColor: "#2073cdbd",
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: 'center',
    fontWeight: "bold",
  },
});

export default AddShipmentClient;
