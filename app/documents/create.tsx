import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreateDocumentMutation } from '@api/documentApi';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import { theme } from '@constants/theme';

const AddPolicy: React.FC = () => {
  // state
  const [noDocumento, setNoDocumento] = useState<string>('');

  // hooks
  const router = useRouter();

  // mutations
  const [create, { isLoading }] = useCreateDocumentMutation();

  // handlers
  const handleSubmit = async () => {
    if (!noDocumento) {
      alert('Por favor ingresa el número de documento');
      return;
    }

    const policyDetails = {
      documentNumber: noDocumento,
    };

    const resp = await create(policyDetails);
    console.log('Detalles de la póliza:', policyDetails, resp);
    router.back();
  };

  return (
    <FormScreen
      title="Agregar Póliza"
      onBack={() => router.back()}
      icon={<MaterialCommunityIcons name="file-document" size={22} color={theme.colors.white} />}
    >
      <FormInput
        label="No. Documento"
        required
        value={noDocumento}
        onChangeText={setNoDocumento}
        placeholder="Ingrese el número de documento"
      />
      <AppButton title="Guardar Póliza" onPress={handleSubmit} loading={isLoading} />
    </FormScreen>
  );
};

export default AddPolicy;
