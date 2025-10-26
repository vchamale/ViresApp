import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import BackgroundView from '@components/BackgroundView';
import { MaterialIcons } from '@expo/vector-icons';
import { useCreateDriverMutation } from '@api/driverApi';
import { useGetAllTrucksQuery } from '@api/truckApi';
import Dropdown from '@components/Dropdown';
import { type TruckT } from '@types/Truck';
import { useGetAllRolesQuery } from '@api/roleApi';

const CreateDriver: React.FC = () => {
  const [names, setNames] = useState<string>('');
  const [lastNames, setLastNames] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [license, setLicense] = useState<string>('');
  const [truckSelected, setTruckSelected] = useState<TruckT | null>(null);
  const [roleSelected, setRoleSelected] = useState<TruckT | null>(null);

  const router = useRouter();

  // Mutation para crear un nuevo conductor
  const [createDriver] = useCreateDriverMutation();

  // queries
  const { currentData: trucks } = useGetAllTrucksQuery({});
  const { currentData: roles } = useGetAllRolesQuery({});

  const handleSubmit = async () => {
    if (!names || !lastNames || !email || !telephone || !license) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const driverDetails = {
      names,
      lastNames,
      email: email.toLowerCase(),
      telephone,
      license,
      truckId: truckSelected?.truckId,
      roleId: roleSelected?.roleId,
    };

    console.log('Detalles del conductor:', driverDetails);

    try {
      const response = await createDriver(driverDetails).unwrap();
      console.log('Driver creado exitosamente:', response);
      router.back();
    } catch (error) {
      console.error('Error al crear el conductor:', error);
      alert('Hubo un error al crear el conductor.');
    }
  };

  const handleSelectTruck = (truck: TruckT) => {
    setTruckSelected(truck);
  };

  const handleSelectRole = (role: any) => {
    setRoleSelected(role);
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Agregar Conductor"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MaterialIcons name="person-add-alt" size={150} color="#fff" />
        </View>
        <Space vertical size={50} />
        <ScrollView style={styles.container}>
          <View>
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

            <Text style={styles.label}>Trailer</Text>
            <Dropdown
              items={trucks}
              placeholder="Selecciona una trailer"
              renderItemText={(item) => `${item.plate}`}
              onItemSelected={(item: TruckT) => handleSelectTruck(item)}
              linkText="Agregar nuevo trailer"
              onLinkPress={() => console.log('Botón tipo link presionado')}
            />

            <Text style={styles.label}>Rol</Text>
            <Dropdown
              items={roles}
              placeholder="Selecciona una rol"
              renderItemText={(item) => `${item.name}`}
              onItemSelected={(item: any) => handleSelectRole(item)}
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
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar Conductor</Text>
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
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CreateDriver;
