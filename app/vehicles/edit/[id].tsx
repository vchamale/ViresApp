import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetTruckByIdQuery, useUpdateTruckMutation } from '@api/truckApi';
import { useGetAllMakeQuery, useGetAllModelsByMakeIdQuery } from '@api/makeApi';
import Dropdown from '@components/Dropdown';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import ConfirmDialog from '@components/ui/ConfirmDialog';
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

const EditVehicle: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [plate, setPlate] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [makeSelected, setMakeSelected] = useState<any>(null);
  const [modelSelected, setModelSelected] = useState<any>(null);

  const router = useRouter();

  // mutations
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateTruckMutation();

  // Querys
  const { data: vehicle, isLoading, isError } = useGetTruckByIdQuery(id ?? skipToken);
  const { data: makeList } = useGetAllMakeQuery({});
  const { data: modelList } = useGetAllModelsByMakeIdQuery(
    makeSelected?.makeId ? { id: makeSelected.makeId } : skipToken,
  );

  useEffect(() => {
    if (vehicle) {
      setPlate(vehicle.plate ?? '');
      setVin(vehicle.vin ?? '');
      setYear(vehicle.year != null ? String(vehicle.year) : '');
      setModelSelected(vehicle.model ?? null);
    }
  }, [vehicle]);

  useEffect(() => {
    if (vehicle?.model?.makeId && makeList?.length) {
      const make = makeList.find((make: any) => make.makeId === vehicle.model.makeId);
      setMakeSelected(make ?? null);
    }
  }, [makeList, vehicle]);

  useEffect(() => {
    if (!vehicle) return;
    setIsModified(
      plate !== (vehicle.plate ?? '') ||
        vin !== (vehicle.vin ?? '') ||
        year !== (vehicle.year != null ? String(vehicle.year) : '') ||
        modelSelected?.modelId !== vehicle.model?.modelId,
    );
  }, [plate, vin, year, modelSelected, vehicle]);

  const plateError = plate ? validatePlate(plate) : null;
  const yearError = year ? validateYear(year) : null;

  const handleSubmit = () => {
    if (!plate || !vin || !year || !modelSelected?.modelId) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (plateError || yearError) {
      alert(plateError ?? yearError);
      return;
    }

    setAlertVisible(true);
  };

  const handleUpdateVehicle = async () => {
    try {
      const response = await updateVehicle({
        id,
        body: { plate, vin, year, modelId: modelSelected?.modelId },
      }).unwrap();
      console.log('Vehicle updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Hubo un error al actualizar el vehículo.');
    }
  };

  const handleMakeSelected = (item: any) => {
    setMakeSelected(item);
    setModelSelected(null);
  };

  return (
    <FormScreen
      title="Editar Vehículo"
      onBack={() => router.back()}
      icon={<MaterialCommunityIcons name="archive-edit" size={22} color={theme.colors.white} />}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : isError ? (
        <Text style={styles.errorText}>
          No se pudo cargar la información del vehículo. Intenta de nuevo.
        </Text>
      ) : (
        <>
          <ConfirmDialog
            visible={isAlertVisible}
            text="Estas a punto de modificar el vehículo, deseas continuar?"
            loading={isUpdating}
            onCancel={() => setAlertVisible(false)}
            onConfirm={handleUpdateVehicle}
          />
          <FormInput
            label="Placa"
            value={plate}
            onChangeText={(text) => setPlate(sanitizePlate(text))}
            placeholder="Ej. ABC123"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={PLATE_MAX_LENGTH}
            error={plateError ?? undefined}
          />
          <FormInput
            label="VIN"
            value={vin}
            onChangeText={setVin}
            placeholder="Ingrese el VIN del vehículo"
          />
          <FormInput
            label="Año"
            value={year}
            onChangeText={(text) => setYear(sanitizeYear(text))}
            placeholder="Ingrese el año del vehículo"
            keyboardType="number-pad"
            maxLength={YEAR_MAX_LENGTH}
            error={yearError ?? undefined}
          />

          <Text style={styles.label}>Marca</Text>
          <Dropdown
            items={makeList ?? []}
            placeholder="Selecciona una marca"
            placeholderColor={theme.colors.primary}
            renderItemText={(item) => item?.name ?? ''}
            onItemSelected={(item) => handleMakeSelected(item)}
            initialSelectedItem={makeSelected ?? undefined}
          />

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

          <Space vertical size={16} />
          <AppButton title="Guardar Cambios" onPress={handleSubmit} disabled={!isModified} />
          <Space vertical size={50} />
        </>
      )}
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primaryLight,
    marginBottom: 8,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    textAlign: 'center',
    color: '#333',
    marginTop: 40,
    paddingHorizontal: 20,
  },
});

export default EditVehicle;
