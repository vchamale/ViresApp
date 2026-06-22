import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { useUpdateTruckMutation } from '@api/truckApi';
import { useGetAllMakeQuery, useGetAllModelsByMakeIdQuery } from '@api/makeApi';
import Dropdown from '@components/Dropdown';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import ConfirmDialog from '@components/ui/ConfirmDialog';
import Space from '@components/Space';
import { theme } from '@constants/theme';

const EditVehicle: React.FC = () => {
  const { vehicle, id } = useLocalSearchParams();
  const parsedVehicle = JSON.parse(vehicle as string);

  const [plate, setPlate] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [makeSelected, setMakeSelected] = useState({});
  const [modelSelected, setModelSelected] = useState(null);

  const router = useRouter();

  // mutations
  const [updateVehicle] = useUpdateTruckMutation();

  // Querys
  const { data: makeList } = useGetAllMakeQuery({});
  const { data: modelList } = useGetAllModelsByMakeIdQuery(
    makeSelected?.makeId ? { id: makeSelected.makeId } : skipToken,
  );

  useEffect(() => {
    if (parsedVehicle) {
      setPlate(parsedVehicle.plate);
      setVin(parsedVehicle.vin);
      setYear(parsedVehicle.year);
    }
  }, []);

  useEffect(() => {
    if (parsedVehicle && makeList?.length > 0) {
      const make = makeList?.find((make: any) => parsedVehicle.model.makeId === make.makeId);
      setMakeSelected(make);
      setModelSelected(parsedVehicle.model);
    }
  }, [makeList]);

  useEffect(() => {
    setIsModified(
      plate !== parsedVehicle.plate ||
        vin !== parsedVehicle.vin ||
        year !== parsedVehicle.year ||
        modelSelected?.name !== parsedVehicle.model.name,
    );
  }, [
    plate,
    vin,
    year,
    modelSelected?.name,
    parsedVehicle.plate,
    parsedVehicle.vin,
    parsedVehicle.year,
    parsedVehicle.model.name,
  ]);

  const handleSubmit = () => {
    if (!plate || !vin || !year || !modelSelected?.name) {
      alert('Por favor completa todos los campos obligatorios');
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
      alert('Hubo un error al actualizar el punto de partida.');
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
      icon={<MaterialCommunityIcons name="archive-edit" size={150} color={theme.colors.white} />}
    >
      <ConfirmDialog
        visible={isAlertVisible}
        text="Estas a punto de modificar el vehiculo, deseas continuar?"
        onCancel={() => setAlertVisible(false)}
        onConfirm={handleUpdateVehicle}
      />
      <FormInput
        label="Placa"
        value={plate}
        onChangeText={setPlate}
        placeholder="Ingrese la placa del vehículo"
      />
      <FormInput
        label="VIN"
        value={vin}
        onChangeText={setVin}
        placeholder="Ingrese el VIN del vehículo"
      />
      <FormInput
        label="Año"
        value={`${year}`}
        onChangeText={setYear}
        placeholder="Ingrese el año del vehículo"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Marca</Text>
      <Dropdown
        items={makeList}
        placeholder="Selecciona una marca"
        placeholderColor={theme.colors.primary}
        renderItemText={(item) => `${item?.name}`}
        onItemSelected={(item) => handleMakeSelected(item)}
        initialSelectedItem={makeSelected ?? undefined}
      />

      <Text style={styles.label}>Modelo</Text>
      <Dropdown
        items={modelList}
        placeholder="Selecciona un modelo"
        placeholderColor={theme.colors.primary}
        renderItemText={(item) => `${item?.name}`}
        onItemSelected={(item) => setModelSelected(item)}
        initialSelectedItem={modelSelected ?? undefined}
      />

      <Space vertical size={16} />
      <AppButton title="Guardar Cambios" onPress={handleSubmit} disabled={!isModified} />
      <Space vertical size={50} />
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
});

export default EditVehicle;
