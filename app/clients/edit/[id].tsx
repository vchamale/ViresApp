import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUpdateClientMutation } from '@api/clientApi';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import ConfirmDialog from '@components/ui/ConfirmDialog';
import Space from '@components/Space';
import { theme } from '@constants/theme';

const EditClient: React.FC = () => {
  const { client, id } = useLocalSearchParams(); // Recibe los datos del cliente
  const parsedClient = JSON.parse(client as string);

  const [nit, setNit] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  const router = useRouter();

  const [updateClient] = useUpdateClientMutation();

  useEffect(() => {
    if (parsedClient) {
      setNit(parsedClient.nit);
      setName(parsedClient.name);
      setAddress(parsedClient.address);
      setContactName(parsedClient.contactName);
      setTelephone(parsedClient.telephone);
      setEmail(parsedClient.email);
    }
  }, []);

  useEffect(() => {
    setIsModified(
      name !== parsedClient.name ||
        address !== parsedClient.address ||
        nit !== parsedClient.nit ||
        contactName !== parsedClient.contactName ||
        telephone !== parsedClient.telephone ||
        email !== parsedClient.email,
    );
  }, [
    name,
    address,
    nit,
    contactName,
    telephone,
    email,
    parsedClient.nit,
    parsedClient.name,
    parsedClient.address,
    parsedClient.contactName,
    parsedClient.telephone,
    parsedClient.email,
  ]);

  const handleSubmit = () => {
    if (!name || !address || !nit || !contactName || !telephone || !email) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setAlertVisible(true);
  };

  const handleUpdateClient = async () => {
    try {
      const response = await updateClient({
        id,
        body: { name, address, nit, contactName, telephone, email },
      }).unwrap();
      console.log('Client updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  return (
    <FormScreen
      title="Editar Cliente"
      onBack={() => router.back()}
      icon={<FontAwesome5 name="user-plus" size={22} color={theme.colors.white} />}
    >
      <ConfirmDialog
        visible={isAlertVisible}
        text="Estas a punto de modificar la poliza, deseas continuar?"
        onCancel={() => setAlertVisible(false)}
        onConfirm={handleUpdateClient}
      />
      <FormInput label="NIT" value={nit} onChangeText={setNit} placeholder="Ingrese el NIT" />
      <FormInput
        label="Nombre"
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
        value={telephone}
        onChangeText={setTelephone}
        keyboardType="phone-pad"
        placeholder="Ingrese el teléfono"
      />
      <FormInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Ingrese el correo electrónico"
      />
      <AppButton
        title="Guardar Cambios"
        onPress={handleSubmit}
        disabled={!isModified}
      />
      <Space vertical size={30} />
    </FormScreen>
  );
};

export default EditClient;
