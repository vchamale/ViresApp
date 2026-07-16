import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useUpdateOriginMutation } from '@api/originApi';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import ConfirmDialog from '@components/ui/ConfirmDialog';
import { theme } from '@constants/theme';

const EditOrigin: React.FC = () => {
  const { origin, id } = useLocalSearchParams();
  const parsedOrigin = JSON.parse(origin as string);

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);

  const router = useRouter();

  // mutations
  const [updateOrigin, { isLoading: isUpdating }] = useUpdateOriginMutation();

  // Inicializar los valores con los datos existentes del origen
  useEffect(() => {
    if (parsedOrigin) {
      setName(parsedOrigin.name);
      setAddress(parsedOrigin.address);
    }
  }, []);

  useEffect(() => {
    setIsModified(name !== parsedOrigin.name || address !== parsedOrigin.address);
  }, [name, address, parsedOrigin.name, parsedOrigin.address]);

  const handleSubmit = () => {
    if (!name || !address) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setAlertVisible(true);
  };

  const handleUpdateOrigin = async () => {
    try {
      const response = await updateOrigin({ id, body: { name, address } }).unwrap();
      console.log('Origin updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating origin:', error);
      alert('Hubo un error al actualizar el punto de partida.');
    }
  };

  return (
    <FormScreen
      title="Editar Origen"
      onBack={() => router.back()}
      icon={<MaterialIcons name="edit-location-alt" size={22} color={theme.colors.white} />}
    >
      <ConfirmDialog
        visible={isAlertVisible}
        text="Estas a punto de modificar la poliza, deseas continuar?"
        loading={isUpdating}
        onCancel={() => setAlertVisible(false)}
        onConfirm={handleUpdateOrigin}
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

export default EditOrigin;
