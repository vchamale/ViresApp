// R/RN
import React, { useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView, FlatList } from 'react-native';
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
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={styles.container}>
        <CustomHeader 
          title={'Agrega Cliente'} 
          onBackPress={() => {
            router.back();
          }}
        />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <FontAwesome6 name='user-group' size={100} color='#5db075' />
          </View>
          <FlatList
            contentContainerStyle={styles.flatListContainer}
            data={[{ key: 'form' }]}
            keyExtractor={(item) => item.key}
            renderItem={() => (
              <>
              <Dropdown 
                items={clients}
                placeholder="Selecciona un cliente"
                renderItemText={(item) => `${item.name}`}
                onItemSelected={(item) => handleClientSelected(item)}
                linkText="Agregar nuevo cliente"
                onLinkPress={() => console.log('Botón tipo link presionado')}
              />
              </>
              )}
            />
          <Button title="Continuar" onPress={handleContinueButton} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
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
  }
});

export default AddShipmentClient;
