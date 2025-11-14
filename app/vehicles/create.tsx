import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import BackgroundView from '@components/BackgroundView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetAllMakeQuery, useGetAllModelsByMakeIdQuery } from '@api/makeApi';
import Dropdown from '@components/Dropdown';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCreateTruckMutation } from '@api/truckApi';

const AddVehicle: React.FC = () => {
  const [plate, setPlate] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [makeSelected, setMakeSelected] = useState(null);
  const [modelSelected, setModelSelected] = useState(null);

  const router = useRouter();

  const { data: makeList, isLoading: isMakeLoading, isError: isMakeError } = useGetAllMakeQuery({});
  const {
    data: modelList,
    isLoading: isModelLoading,
    isError: isModelError,
  } = useGetAllModelsByMakeIdQuery(makeSelected?.makeId ? { id: makeSelected.makeId } : skipToken);

  // mutations

  const [create] = useCreateTruckMutation();

  const handleSubmit = async () => {
    if (!plate || !year || !modelSelected?.modelId) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const vehicleDetails = {
      plate,
      vin,
      year,
      modelId: modelSelected?.modelId,
    };

    console.log('Detalles del vehículo:', vehicleDetails);
    const response = await create(vehicleDetails);
    console.log('response ', response);

    router.back();
  };

  const handleMakeSelected = (item: any) => {
    setMakeSelected(item);
    setModelSelected(null);
  };
  const handleModelSelected = (item: any) => {
    setModelSelected(item);
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Agregar Vehículo"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="archive-plus" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <ScrollView style={styles.container}>
          <Text style={styles.label}>Marca</Text>
          <Dropdown
            items={makeList}
            placeholder="Selecciona una marca"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item?.name}`}
            onItemSelected={(item) => handleMakeSelected(item)}
            initialSelectedItem={makeSelected ?? undefined}
          />

          {makeSelected && (
            <>
              <Text style={styles.label}>Modelo</Text>
              <Dropdown
                items={modelList}
                placeholder="Selecciona un modelo"
                placeholderColor="#71a780"
                renderItemText={(item) => `${item?.name}`}
                onItemSelected={(item) => handleModelSelected(item)}
                initialSelectedItem={modelSelected ?? undefined}
              />
            </>
          )}

          <Text style={styles.label}>Placa</Text>
          <TextInput
            style={styles.input}
            value={plate}
            onChangeText={(text) => setPlate(text.toUpperCase())}
            placeholder="Ingrese la placa del vehículo"
          />

          <Text style={styles.label}>vin</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={(text) => setVin(text.toUpperCase())}
            placeholder="Ingrese el vin del vehículo"
          />

          <Text style={styles.label}>Año</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            placeholder="Ingrese el año del vehículo"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar Vehículo</Text>
          </TouchableOpacity>
          <Space vertical size={35} />
        </ScrollView>
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
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddVehicle;
