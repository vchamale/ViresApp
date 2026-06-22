import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useUpdateDestinationMutation } from '@api/destinationApi';
import { useGetAllClientsQuery } from '@api/clientApi';
import Dropdown from '@components/Dropdown';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import ConfirmDialog from '@components/ui/ConfirmDialog';
import { theme } from '@constants/theme';

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

  const { data: clientList } = useGetAllClientsQuery({});

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
    if (!name || !address || !clientSelected) {
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

  return (
    <FormScreen
      title="Editar Destino"
      onBack={() => router.back()}
      icon={<MaterialIcons name="edit-location-alt" size={22} color={theme.colors.white} />}
    >
      <ConfirmDialog
        visible={isAlertVisible}
        text="Estas a punto de modificar la poliza, deseas continuar?"
        onCancel={() => setAlertVisible(false)}
        onConfirm={handleUpdateDestination}
      />
      <Text style={styles.label}>Cliente</Text>
      <Dropdown
        items={clientList}
        placeholder="Selecciona un cliente"
        placeholderColor={theme.colors.primary}
        renderItemText={(item) => `${item?.name}`}
        onItemSelected={(item) => setClientSelected(item)}
        initialSelectedItem={clientSelected ?? undefined}
      />
      <FormInput
        label="Lugar (Nombre)"
        value={name}
        onChangeText={setName}
        placeholder="Ingrese el nombre del origen"
      />
      <FormInput
        label="Dirección"
        value={address}
        onChangeText={setAddress}
        placeholder="Ingrese la dirección del origen"
      />
      <AppButton title="Guardar Cambios" onPress={handleSubmit} disabled={!isModified} />
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
});

export default EditDestination;
