import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCreateOriginMutation } from '@api/originApi';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import { theme } from '@constants/theme';

const CreateOrigin: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const { clientId } = useLocalSearchParams();
  const router = useRouter();

  // mutations
  const [create, { isLoading }] = useCreateOriginMutation();

  const handleSubmit = async () => {
    if (!name || !address) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const originDetails = {
      name,
      address,
      clientId,
    };

    const resp = await create(originDetails);
    console.log('resp ', resp);
    router.back();
  };

  return (
    <FormScreen
      title="Agregar Punto de Partida"
      onBack={() => router.back()}
      icon={<MaterialIcons name="add-location-alt" size={22} color={theme.colors.white} />}
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
      <AppButton title="Guardar Punto de Partida" onPress={handleSubmit} loading={isLoading} />
    </FormScreen>
  );
};

export default CreateOrigin;
