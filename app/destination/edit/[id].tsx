import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import BackgroundView from '@components/BackgroundView';
import { useUpdateDestinationMutation } from '@api/destinationApi';
import CustomAlert from '@components/CustomAlert';
import { MaterialIcons } from '@expo/vector-icons';
import { useGetAllClientsQuery } from '@api/clientApi';
import Dropdown from '@components/Dropdown';

const EditDestination: React.FC = () => {
  const { destination, id } = useLocalSearchParams();
  const parsedDestination = JSON.parse(destination as string);

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [clientSelected, setClientSelected] = useState(null);

  const router = useRouter();

  // mutations

  const [updateDestination] = useUpdateDestinationMutation();

  const {
    data: clientList,
    isLoading: isMakeLoading,
    isError: isMakeError,
  } = useGetAllClientsQuery({});

  // Inicializar los valores con los datos existentes del origen
  useEffect(() => {
    if (parsedDestination) {
      setName(parsedDestination.name);
      setAddress(parsedDestination.address);
    }
  }, []);

  useEffect(() => {
    if (parsedDestination && clientList?.length > 0) {
      const client = clientList?.find(
        (client: any) => parsedDestination.clientId === client.clientId,
      );
      setClientSelected(client);
    }
  }, [clientList]);

  useEffect(() => {
    setIsModified(
      name !== parsedDestination.name ||
        address !== parsedDestination.address ||
        clientSelected?.clientId !== parsedDestination.clientId,
    );
  }, [
    name,
    address,
    clientSelected?.clientId,
    parsedDestination.clientId,
    parsedDestination.name,
    parsedDestination.address,
  ]);

  const handleSubmit = () => {
    if (!name) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!address) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!clientSelected) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setAlertVisible(true);
  };

  const handleUpdateDestination = async () => {
    try {
      const response = await updateDestination({
        id,
        body: { name, address, clientId: clientSelected?.clientId },
      }).unwrap();
      console.log('Destination updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating destination:', error);
      alert('Hubo un error al actualizar el punto de partida.');
    }
  };

  const handleClientSelected = (item: any) => {
    setClientSelected(item);
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Editar Destino"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <CustomAlert
          isVisible={isAlertVisible}
          title="Estas seguro de modificar?"
          titleColor="#ff0809bd"
          text="Estas a punto de modificar la poliza, deseas continuar?"
          onClose={() => {
            setAlertVisible(false);
          }}
          buttons={[
            <Pressable
              onPress={() => {
                setAlertVisible(false);
              }}
            >
              <View style={styles.cancelButtonAlert}>
                <Text style={styles.cancelButtonTextAlert}>Cancelar</Text>
              </View>
            </Pressable>,
            <Pressable
              onPress={() => {
                handleUpdateDestination();
                setAlertVisible(false);
              }}
            >
              <View style={styles.continueButtonAlert}>
                <Text style={styles.continueButtonTextAlert}>Modificar</Text>
              </View>
            </Pressable>,
          ]}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MaterialIcons name="edit-location-alt" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <View style={styles.container}>
          <View>
            <Text style={styles.label}>Cliente</Text>
            <Dropdown
              items={clientList}
              placeholder="Selecciona un cliente"
              placeholderColor="#71a780"
              renderItemText={(item) => `${item?.name}`}
              onItemSelected={(item) => handleClientSelected(item)}
              initialSelectedItem={clientSelected ?? undefined}
            />
            <Text style={styles.label}>Lugar (Nombre)</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ingrese el nombre del origen"
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Ingrese la dirección del origen"
            />
          </View>
          <TouchableOpacity
            style={[styles.submitButton, !isModified && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!isModified}
          >
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#71a780',
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
  submitButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#9fa8da',
    opacity: 0.7,
  },
  submitButtonText: {
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

export default EditDestination;
