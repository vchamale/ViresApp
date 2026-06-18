import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import BackgroundView from '@components/BackgroundView';
import CustomAlert from '@components/CustomAlert';
import { MaterialIcons } from '@expo/vector-icons';
import { useUpdateDriverMutation } from '@api/driverApi';
import Dropdown from '@components/Dropdown';
import { useGetAllTrucksQuery } from '@api/truckApi';
import { type TruckT } from '@models/Truck';

const EditDriver: React.FC = () => {
  const { driver, id } = useLocalSearchParams();
  const parsedDriver = JSON.parse(driver as string);

  const [names, setNames] = useState<string>('');
  const [lastNames, setLastNames] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [license, setLicense] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [truckSelected, setTruckSelected] = useState<TruckT | null>(null);

  const router = useRouter();

  // Mutation para actualizar el conductor
  const [updateDriver] = useUpdateDriverMutation();

  // queries
  const { currentData: trucks } = useGetAllTrucksQuery({});

  // Inicializar los valores con los datos existentes del conductor
  useEffect(() => {
    if (parsedDriver) {
      setNames(parsedDriver.names);
      setLastNames(parsedDriver.lastNames);
      setEmail(parsedDriver.email);
      setTelephone(parsedDriver.telephone);
      setLicense(parsedDriver.license);
    }
  }, []);

  useEffect(() => {
    if (parsedDriver && trucks?.length > 0) {
      const truck = trucks?.find((truck: any) => parsedDriver?.truck?.truckId === truck.truckId);
      setTruckSelected(truck);
    }
  }, [trucks]);

  useEffect(() => {
    setIsModified(
      names !== parsedDriver.names ||
        lastNames !== parsedDriver.lastNames ||
        email !== parsedDriver.email ||
        telephone !== parsedDriver.telephone ||
        license !== parsedDriver.license ||
        truckSelected?.truckId !== parsedDriver?.truck?.truckId,
    );
  }, [names, lastNames, email, telephone, license, parsedDriver, truckSelected]);

  const handleSubmit = () => {
    if (!names || !lastNames || !email || !telephone || !license) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setAlertVisible(true);
  };

  const handleUpdateDriver = async () => {
    try {
      const updatedDriver = {
        names,
        lastNames,
        email,
        telephone,
        license,
        truckId: truckSelected?.truckId,
      };

      const response = await updateDriver({ id, body: updatedDriver }).unwrap();
      console.log('Driver updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating driver:', error);
      alert('Hubo un error al actualizar el conductor.');
    }
  };

  const handleSelectTruck = (truck: TruckT) => {
    setTruckSelected(truck);
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Editar Conductor"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <CustomAlert
          isVisible={isAlertVisible}
          title="¿Estás seguro de modificar?"
          titleColor="#ff0809bd"
          text="Estás a punto de modificar la información del conductor, ¿deseas continuar?"
          onClose={() => setAlertVisible(false)}
          buttons={[
            <Pressable onPress={() => setAlertVisible(false)}>
              <View style={styles.cancelButtonAlert}>
                <Text style={styles.cancelButtonTextAlert}>Cancelar</Text>
              </View>
            </Pressable>,
            <Pressable onPress={handleUpdateDriver}>
              <View style={styles.continueButtonAlert}>
                <Text style={styles.continueButtonTextAlert}>Modificar</Text>
              </View>
            </Pressable>,
          ]}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MaterialIcons name="edit" size={150} color="#fff" />
        </View>
        <Space vertical size={70} />
        <ScrollView style={styles.container}>
          <View>
            <Text style={styles.label}>Trailer</Text>
            <Dropdown
              items={trucks}
              placeholder="Selecciona una trailer"
              renderItemText={(item) => `${item.plate}`}
              onItemSelected={(item: TruckT) => handleSelectTruck(item)}
              linkText="Agregar nuevo trailer"
              onLinkPress={() => console.log('Botón tipo link presionado')}
              initialSelectedItem={truckSelected ?? undefined}
            />

            <Text style={styles.label}>Nombres</Text>
            <TextInput
              style={styles.input}
              value={names}
              onChangeText={setNames}
              placeholder="Ingrese los nombres"
            />

            <Text style={styles.label}>Apellidos</Text>
            <TextInput
              style={styles.input}
              value={lastNames}
              onChangeText={setLastNames}
              placeholder="Ingrese los apellidos"
            />

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Ingrese el correo electrónico"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={telephone}
              onChangeText={setTelephone}
              placeholder="Ingrese el teléfono"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Licencia</Text>
            <TextInput
              style={styles.input}
              value={license}
              onChangeText={setLicense}
              placeholder="Ingrese el número de licencia"
            />
          </View>
          <TouchableOpacity
            style={[styles.submitButton, !isModified && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!isModified}
          >
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default EditDriver;
