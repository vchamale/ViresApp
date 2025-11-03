// R/RN
import React, { useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
// Expo stuff
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// API
import { useGetAllClientsQuery } from '@api/clientApi';
// Components
import Dropdown from '@components/Dropdown';
import CustomHeader from '@components/CustomHeader';
import { useAppDispatch, useAppSelector } from '@hooks/useRedux';
import { addClient, reset, shipmentSelector } from '@slice/shipmentSlice';
import { ClientT } from '@models/Shipment';
import { useSnackbar } from '@components/context/SnackbarContext';
import BackgroundView from '@components/BackgroundView';
import Space from '@components/Space';
import DropdownWrapper from '@components/DropdownWrapper';
import { pageControlSelector, setSingleShipmentCreatePage } from '@slice/pageControlSlice';
import CustomAlert from '@components/CustomAlert';

const AddShipmentClient = () => {
  // State
  const [isResetShipmentAlertVisible, setResetShipmentAlertVisible] = useState<boolean>(false);

  // Vars

  // Store
  const dispatch = useAppDispatch();
  const { client } = useAppSelector(shipmentSelector) ?? {};
  const { isSingleShipmentCreatePage } = useAppSelector(pageControlSelector);

  // hooks
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  // API Calls
  // Querys
  const {
    currentData: clients,
    isError: isErrorClients,
    error: errorClients,
    isLoading: isLoadingClients,
    refetch: refetchClients,
    isFetching: isFetchingClients,
  } = useGetAllClientsQuery({});
  ///////

  // Functions
  const handleClientSelected = (item: any) => {
    dispatch(addClient(item));
    // setClient(item);
  };

  const handleResetShipment = () => {
    dispatch(reset());
    router.back();
  };

  const handleContinueButton = () => {
    if (!client) {
      return showSnackbar({
        message: 'Debes seleccionar un cliente para continuear.',
        color: 'red',
        duration: 3000,
      });
    }

    // dispatch(addClient(client));
    router.push('/shipments/create/shipping-route');
  };

  // Computations

  return (
    <BackgroundView>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <CustomHeader
            title={'Agrega Cliente'}
            backgroundColor="#71a780"
            color="#fff"
            onBackPress={() => setResetShipmentAlertVisible(true)}
            isSinglePage={isSingleShipmentCreatePage}
            showChangeViewButton={true}
            onChangeViewPress={() => {
              dispatch(setSingleShipmentCreatePage(true));
              router.replace('/shipments/create/single/create');
            }}
          />
          <CustomAlert
            isVisible={isResetShipmentAlertVisible}
            title="Alerta"
            titleColor="#ff0809bd"
            text="Si regresas el progreso de tu viaje sera eliminado y deberas de ingresarlo de nuevo, deseas continuar?"
            onClose={() => {
              setResetShipmentAlertVisible(false);
            }}
            buttons={[
              <Pressable
                onPress={() => {
                  setResetShipmentAlertVisible(false);
                }}
              >
                <View style={styles.cancelButtonAlert}>
                  <Text style={styles.cancelButtonTextAlert}>Cancelar</Text>
                </View>
              </Pressable>,
              <Pressable
                onPress={() => {
                  handleResetShipment();
                  setResetShipmentAlertVisible(false);
                }}
              >
                <View style={styles.continueButtonAlert}>
                  <Text style={styles.continueButtonTextAlert}>Continuar</Text>
                </View>
              </Pressable>,
            ]}
          />
          <Space vertical size={50} />
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <FontAwesome6 name="user-group" size={100} color="#fff" />
            </View>
            <Space vertical size={80} />
            <View
              style={{
                backgroundColor: '#71a780',
                marginHorizontal: 20,
                padding: 20,
                borderRadius: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <FlatList
                contentContainerStyle={styles.flatListContainer}
                data={[{ key: 'form' }]}
                keyExtractor={(item) => item.key}
                renderItem={() => (
                  <>
                    <DropdownWrapper
                      isLoading={isLoadingClients}
                      isFetching={isFetchingClients}
                      isError={isErrorClients}
                      items={clients}
                      placeholder="Selecciona un cliente"
                      placeholderColor="#71a780"
                      renderItemText={(item) => `${item.name}`}
                      onItemSelected={(item: ClientT) => handleClientSelected(item)}
                      refetch={refetchClients}
                      linkText="Agregar nuevo cliente"
                      onLinkPress={() => console.log('Botón tipo link presionado')}
                      {...(client && { initialSelectedItem: client })}
                    />
                    {/* <Dropdown 
                      items={clients}
                      placeholder="Selecciona un cliente"
                      placeholderColor='#71a780'
                      renderItemText={(item) => `${item.name}`}
                      onItemSelected={(item) => handleClientSelected(item)}
                      linkText="Agregar nuevo cliente"
                      onLinkPress={() => console.log('Botón tipo link presionado')}
                    /> */}
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
    padding: 20,
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
  },
  createButton: {
    marginHorizontal: 50,
    backgroundColor: '#2073cdbd',
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButtonAlert: {
    backgroundColor: '#ff0809bd',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginTop: 20,
  },
  cancelButtonTextAlert: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  continueButtonAlert: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginTop: 20,
  },
  continueButtonTextAlert: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddShipmentClient;
