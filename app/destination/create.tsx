import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCreateDestinationMutation } from '@api/destinationApi';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import { theme } from '@constants/theme';

const CreateDestination: React.FC = () => {
  const { clientId } = useLocalSearchParams();

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const router = useRouter();

  // mutations
  const [create, { isLoading }] = useCreateDestinationMutation();

  const handleSubmit = async () => {
    if (!name || !address) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const destinationDetails = {
      name,
      address,
      clientId,
    };

    await create(destinationDetails);
    router.back();
  };

  return (
    <FormScreen
      title="Agregar Destino"
      onBack={() => router.back()}
      icon={<MaterialIcons name="add-location-alt" size={150} color={theme.colors.white} />}
    >
      <FormInput
        label="Lugar (Nombre)"
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
      <AppButton title="Guardar Destino" onPress={handleSubmit} loading={isLoading} />
    </FormScreen>
  );
};

export default CreateDestination;
