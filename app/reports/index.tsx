import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import Space from '@components/Space';

const Reports = () => {
  const [nit, setNit] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(true);

  const router = useRouter();

  const handleSubmit = () => {
    if (!nit || !name || !email || !telephone) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const clientDetails = {
      nit,
      name,
      address,
      contactName,
      telephone,
      email,
      status,
    };

    console.log('Detalles del cliente:', clientDetails);

    // Aquí se puede realizar un dispatch o una llamada API para guardar los datos
    alert('Cliente guardado correctamente');
    router.back();
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Agregar Cliente"
          backgroundColor="#5db075"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <Space vertical size={20} />
        <View style={styles.container}>
          <Text style={styles.label}>NIT *</Text>
          <TextInput
            style={styles.input}
            value={nit}
            onChangeText={setNit}
            placeholder="Ingrese el NIT"
          />

          

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar Cliente</Text>
          </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5db075',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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

export default Reports;
