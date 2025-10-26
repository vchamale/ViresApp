import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import BackgroundView from '@components/BackgroundView';
import CustomAlert from '@components/CustomAlert';
import { useUpdateDocumentMutation } from '@api/documentApi';

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

  const [updateDocument] = useUpdateDocumentMutation();

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
      const response = await updateDocument({ id, body: { documentNumber: noDocument } }).unwrap(); // unwrap para manejar errores
      console.log('Document updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Hubo un error al actualizar el documento.');
    }
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Editar Póliza"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <CustomAlert
          isVisible={isAlertVisible}
          title="Estas seguro de modificar?"
          titleColor="#ff0809bd"
          text="Estas a punto de modificar la poliza, deseas continuar?"
          onClose={() => {
            setAlertVisible(false);
          }}
          buttons={[
            <Pressable
              onPress={() => {
                setAlertVisible(false);
              }}
            >
              <View style={styles.cancelButtonAlert}>
                <Text style={styles.cancelButtonTextAlert}>Cancelar</Text>
              </View>
            </Pressable>,
            <Pressable
              onPress={() => {
                updatePolicy();
                setAlertVisible(false);
              }}
            >
              <View style={styles.continueButtonAlert}>
                <Text style={styles.continueButtonTextAlert}>Modificar</Text>
              </View>
            </Pressable>,
          ]}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="file-document-edit" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <View style={styles.container}>
          <View>
            <Text style={styles.label}>No. Documento</Text>
            <TextInput
              style={styles.input}
              value={noDocument}
              onChangeText={setNoDocument}
              placeholder="Ingrese el número de documento"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !isModified && styles.disabledButton, // Aplica estilo deshabilitado si no está modificado
            ]}
            onPress={handleSubmit}
            disabled={!isModified} // Deshabilita el botón si no hay cambios
          >
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#71a780',
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
  submitButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#9fa8da', // Color más claro para el estado deshabilitado
    opacity: 0.7, // Hacer más opaco el botón deshabilitado
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButtonAlert: {
    backgroundColor: '#ff0809bd',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginTop: 20,
  },
  cancelButtonTextAlert: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  continueButtonAlert: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginTop: 20,
  },
  continueButtonTextAlert: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EditPolicy;
