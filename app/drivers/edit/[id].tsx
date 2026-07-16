import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useUpdateDriverMutation } from '@api/driverApi';
import { useGetAllTrucksQuery } from '@api/truckApi';
import Dropdown from '@components/Dropdown';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import ConfirmDialog from '@components/ui/ConfirmDialog';
import { theme } from '@constants/theme';
import { type TruckT } from '@models/Truck';

const EditDriver: React.FC = () => {
  const { driver, id } = useLocalSearchParams();
  const parsedDriver = JSON.parse(driver as string);

  const [names, setNames] = useState<string>('');
  const [lastNames, setLastNames] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [license, setLicense] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [truckSelected, setTruckSelected] = useState<TruckT | null>(null);

  const router = useRouter();

  // Mutation para actualizar el conductor
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();

  // queries
  const { currentData: trucks } = useGetAllTrucksQuery({});

  // Inicializar los valores con los datos existentes del conductor
  useEffect(() => {
    if (parsedDriver) {
      setNames(parsedDriver.names);
      setLastNames(parsedDriver.lastNames);
      setEmail(parsedDriver.email);
      setTelephone(parsedDriver.telephone);
      setLicense(parsedDriver.license);
    }
  }, []);

  useEffect(() => {
    if (parsedDriver && trucks?.length > 0) {
      const truck = trucks?.find((truck: any) => parsedDriver?.truck?.truckId === truck.truckId);
      setTruckSelected(truck);
    }
  }, [trucks]);

  useEffect(() => {
    setIsModified(
      names !== parsedDriver.names ||
        lastNames !== parsedDriver.lastNames ||
        email !== parsedDriver.email ||
        telephone !== parsedDriver.telephone ||
        license !== parsedDriver.license ||
        truckSelected?.truckId !== parsedDriver?.truck?.truckId,
    );
  }, [names, lastNames, email, telephone, license, parsedDriver, truckSelected]);

  const handleSubmit = () => {
    if (!names || !lastNames || !email || !telephone || !license) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setAlertVisible(true);
  };

  const handleUpdateDriver = async () => {
    try {
      const updatedDriver = {
        names,
        lastNames,
        email,
        telephone,
        license,
        truckId: truckSelected?.truckId,
      };

      const response = await updateDriver({ id, body: updatedDriver }).unwrap();
      console.log('Driver updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating driver:', error);
      alert('Hubo un error al actualizar el conductor.');
    }
  };

  return (
    <FormScreen
      title="Editar Conductor"
      onBack={() => router.back()}
      icon={<MaterialIcons name="edit" size={22} color={theme.colors.white} />}
    >
      <ConfirmDialog
        visible={isAlertVisible}
        text="Estás a punto de modificar la información del conductor, ¿deseas continuar?"
        loading={isUpdating}
        onCancel={() => setAlertVisible(false)}
        onConfirm={handleUpdateDriver}
      />
      <Text style={styles.label}>Trailer</Text>
      <Dropdown
        items={trucks}
        placeholder="Selecciona una trailer"
        renderItemText={(item) => `${item.plate}`}
        onItemSelected={(item: TruckT) => setTruckSelected(item)}
        linkText="Agregar nuevo trailer"
        onLinkPress={() => console.log('Botón tipo link presionado')}
        initialSelectedItem={truckSelected ?? undefined}
      />
      <FormInput
        label="Nombres"
        value={names}
        onChangeText={setNames}
        placeholder="Ingrese los nombres"
      />
      <FormInput
        label="Apellidos"
        value={lastNames}
        onChangeText={setLastNames}
        placeholder="Ingrese los apellidos"
      />
      <FormInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        placeholder="Ingrese el correo electrónico"
        keyboardType="email-address"
      />
      <FormInput
        label="Teléfono"
        value={telephone}
        onChangeText={setTelephone}
        placeholder="Ingrese el teléfono"
        keyboardType="phone-pad"
      />
      <FormInput
        label="Licencia"
        value={license}
        onChangeText={setLicense}
        placeholder="Ingrese el número de licencia"
      />
      <AppButton title="Guardar Cambios" onPress={handleSubmit} disabled={!isModified} />
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

export default EditDriver;
