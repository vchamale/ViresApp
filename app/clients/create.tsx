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
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useCreateClientMutation } from '@api/clientApi';
import Dropdown from '@components/Dropdown';
import { useGetAllClientsQuery } from '@api/clientApi';

const CreateClient: React.FC = () => {
  const [nit, setNit] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const router = useRouter();

  // mutations

  const [create] = useCreateClientMutation();

  const handleSubmit = async () => {
    if (!name || !address || !nit || !contactName || !telephone || !email) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const clientDetails = {
      name,
      address,
      nit,
      contactName,
      telephone,
      email,
    };

    console.log('Detalles del cliente:', clientDetails);

    // Simulación de envío de datos
    const resp = await create(clientDetails);
    console.log('resp ', resp);
    router.back();
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Agregar Cliente"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <FontAwesome5 name="user-edit" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <ScrollView style={styles.container}>
          <View>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ingrese el nombre"
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Ingrese la dirección"
            />

            <Text style={styles.label}>NIT</Text>
            <TextInput
              style={styles.input}
              value={nit}
              onChangeText={setNit}
              placeholder="Ingrese el nit"
            />

            <Text style={styles.label}>Nombre de Contacto</Text>
            <TextInput
              style={styles.input}
              value={contactName}
              onChangeText={setContactName}
              placeholder="Ingrese el nit"
            />

            <Text style={styles.label}>No. de Telefono</Text>
            <TextInput
              style={styles.input}
              value={telephone}
              onChangeText={setTelephone}
              placeholder="Ingrese el nit"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Ingrese el nit"
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar Destino</Text>
          </TouchableOpacity>
          <Space vertical size={20} />
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
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

export default CreateClient;
