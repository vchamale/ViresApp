import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetAllMakeQuery, useGetAllModelsByMakeIdQuery } from '@api/makeApi';
import { useCreateTruckMutation } from '@api/truckApi';
import Dropdown from '@components/Dropdown';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import Space from '@components/Space';
import { theme } from '@constants/theme';
import {
  PLATE_MAX_LENGTH,
  sanitizePlate,
  sanitizeYear,
  validatePlate,
  validateYear,
  YEAR_MAX_LENGTH,
} from 'utils/vehicleValidation';

const AddVehicle: React.FC = () => {
  const [plate, setPlate] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [makeSelected, setMakeSelected] = useState<any>(null);
  const [modelSelected, setModelSelected] = useState<any>(null);

  const router = useRouter();

  const { data: makeList } = useGetAllMakeQuery({});
  const { data: modelList } = useGetAllModelsByMakeIdQuery(
    makeSelected?.makeId ? { id: makeSelected.makeId } : skipToken,
  );

  // mutations
  const [create, { isLoading }] = useCreateTruckMutation();

  const plateError = plate ? validatePlate(plate) : null;
  const yearError = year ? validateYear(year) : null;

  const handleSubmit = async () => {
    if (!plate || !year || !modelSelected?.modelId) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (plateError || yearError) {
      alert(plateError ?? yearError);
      return;
    }

    const vehicleDetails = {
      plate,
      vin,
      year,
      modelId: modelSelected?.modelId,
    };

    try {
      await create(vehicleDetails).unwrap();
      router.back();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert('Hubo un error al crear el vehículo. Intenta de nuevo.');
    }
  };

  const handleMakeSelected = (item: any) => {
    setMakeSelected(item);
    setModelSelected(null);
  };

  return (
    <FormScreen
      title="Agregar Vehículo"
      onBack={() => router.back()}
      icon={<MaterialCommunityIcons name="archive-plus" size={22} color={theme.colors.white} />}
    >
      <Text style={styles.label}>Marca</Text>
      <Dropdown
        items={makeList ?? []}
        placeholder="Selecciona una marca"
        placeholderColor={theme.colors.primary}
        renderItemText={(item) => item?.name ?? ''}
        onItemSelected={(item) => handleMakeSelected(item)}
        initialSelectedItem={makeSelected ?? undefined}
      />

      {makeSelected && (
        <>
          <Text style={styles.label}>Modelo</Text>
          <Dropdown
            key={makeSelected?.makeId ?? 'no-make'}
            items={modelList ?? []}
            placeholder="Selecciona un modelo"
            placeholderColor={theme.colors.primary}
            renderItemText={(item) => item?.name ?? ''}
            onItemSelected={(item) => setModelSelected(item)}
            initialSelectedItem={modelSelected ?? undefined}
          />
        </>
      )}

      <Space vertical size={16} />

      <FormInput
        label="Placa"
        required
        value={plate}
        onChangeText={(text) => setPlate(sanitizePlate(text))}
        placeholder="Ej. ABC123"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={PLATE_MAX_LENGTH}
        error={plateError ?? undefined}
      />
      <FormInput
        label="vin"
        value={vin}
        onChangeText={(text) => setVin(text.toUpperCase())}
        placeholder="Ingrese el vin del vehículo"
      />
      <FormInput
        label="Año"
        required
        value={year}
        onChangeText={(text) => setYear(sanitizeYear(text))}
        keyboardType="number-pad"
        maxLength={YEAR_MAX_LENGTH}
        placeholder="Ingrese el año del vehículo"
        error={yearError ?? undefined}
      />

      <AppButton title="Guardar Vehículo" onPress={handleSubmit} loading={isLoading} />
      <Space vertical size={35} />
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

export default AddVehicle;
