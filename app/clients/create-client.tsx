import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import Space from '@components/Space';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import { theme } from '@constants/theme';

const CreateClient = () => {
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

    // Aquí se puede realizar un dispatch o una llamada API para guardar los datos
    alert('Cliente guardado correctamente');
    router.back();
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Agregar Cliente"
          backgroundColor={theme.colors.primaryLight}
          color={theme.colors.white}
          onBackPress={() => router.back()}
        />
        <Space vertical size={20} />
        <View style={styles.container}>
          <FormInput
            label="NOT"
            required
            value={nit}
            onChangeText={setNit}
            placeholder="Ingrese el nnot"
          />

          <FormInput
            label="Nombre"
            required
            value={name}
            onChangeText={setName}
            placeholder="Ingrese el nombre"
          />

          <FormInput
            label="Dirección"
            value={address}
            onChangeText={setAddress}
            placeholder="Ingrese la dirección"
          />

          <FormInput
            label="Contacto"
            value={contactName}
            onChangeText={setContactName}
            placeholder="Ingrese el nombre del contacto"
          />

          <FormInput
            label="Teléfono"
            required
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            placeholder="Ingrese el teléfono"
          />

          <FormInput
            label="Correo Electrónico"
            required
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Ingrese el correo electrónico"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Estado Activo</Text>
            <Switch value={status} onValueChange={setStatus} />
          </View>

          <AppButton title="Guardar Cliente" onPress={handleSubmit} />
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
    color: theme.colors.primaryLight,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
});

export default CreateClient;
