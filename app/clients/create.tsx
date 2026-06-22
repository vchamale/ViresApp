import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useCreateClientMutation } from '@api/clientApi';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import Space from '@components/Space';
import { theme } from '@constants/theme';

const CreateClient: React.FC = () => {
  const [nit, setNit] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const router = useRouter();

  // mutations: RTK Query expone el estado de carga del request (isLoading)
  const [create, { isLoading }] = useCreateClientMutation();

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

    const resp = await create(clientDetails);
    console.log('resp ', resp);
    router.back();
  };

  return (
    <FormScreen
      title="Agregar Cliente"
      onBack={() => router.back()}
      icon={<FontAwesome5 name="user-edit" size={150} color={theme.colors.white} />}
    >
      <FormInput
        label="Nombre"
        required
        value={name}
        onChangeText={setName}
        placeholder="Ingrese el nombre"
      />
      <FormInput
        label="Dirección"
        required
        value={address}
        onChangeText={setAddress}
        placeholder="Ingrese la dirección"
      />
      <FormInput
        label="NIT"
        required
        value={nit}
        onChangeText={setNit}
        placeholder="Ingrese el nit"
      />
      <FormInput
        label="Nombre de Contacto"
        required
        value={contactName}
        onChangeText={setContactName}
        placeholder="Ingrese el nombre de contacto"
      />
      <FormInput
        label="No. de Telefono"
        required
        value={telephone}
        onChangeText={setTelephone}
        placeholder="Ingrese el número de teléfono"
      />
      <FormInput
        label="Email"
        required
        value={email}
        onChangeText={setEmail}
        placeholder="Ingrese el correo electrónico"
      />
      <AppButton title="Crear Cliente" onPress={handleSubmit} loading={isLoading} />
      <Space vertical size={20} />
    </FormScreen>
  );
};

export default CreateClient;
