import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUpdateDocumentMutation } from '@api/documentApi';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import ConfirmDialog from '@components/ui/ConfirmDialog';
import { theme } from '@constants/theme';

const EditPolicy: React.FC = () => {
  // expo
  const { policy, id } = useLocalSearchParams();
  const parsedPolicy = JSON.parse(policy as string);

  // state
  const [noDocument, setNoDocument] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);

  // hooks
  const router = useRouter();

  // mutations
  const [updateDocument, { isLoading: isUpdating }] = useUpdateDocumentMutation();

  // effects
  useEffect(() => {
    if (parsedPolicy) {
      setNoDocument(parsedPolicy.documentNumber);
    }
  }, []);

  useEffect(() => {
    setIsModified(noDocument !== parsedPolicy.documentNumber);
  }, [noDocument, parsedPolicy.documentNumber]);

  // handlers
  const handleSubmit = () => {
    if (!noDocument) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setAlertVisible(true);
  };

  const updatePolicy = async () => {
    try {
      const response = await updateDocument({ id, body: { documentNumber: noDocument } }).unwrap();
      console.log('Document updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Hubo un error al actualizar el documento.');
    }
  };

  return (
    <FormScreen
      title="Editar Póliza"
      onBack={() => router.back()}
      icon={<MaterialCommunityIcons name="file-document-edit" size={22} color={theme.colors.white} />}
    >
      <ConfirmDialog
        visible={isAlertVisible}
        text="Estas a punto de modificar la poliza, deseas continuar?"
        loading={isUpdating}
        onCancel={() => setAlertVisible(false)}
        onConfirm={updatePolicy}
      />
      <FormInput
        label="No. Documento"
        value={noDocument}
        onChangeText={setNoDocument}
        placeholder="Ingrese el número de documento"
      />
      <AppButton title="Guardar Cambios" onPress={handleSubmit} disabled={!isModified} />
    </FormScreen>
  );
};

export default EditPolicy;
