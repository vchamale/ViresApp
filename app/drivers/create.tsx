import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCreateDriverMutation } from '@api/driverApi';
import { useGetAllTrucksQuery } from '@api/truckApi';
import { useGetAllRolesQuery } from '@api/roleApi';
import Dropdown from '@components/Dropdown';
import FormScreen from '@components/layout/FormScreen';
import FormInput from '@components/form/FormInput';
import AppButton from '@components/ui/AppButton';
import Space from '@components/Space';
import { theme } from '@constants/theme';
import { type TruckT } from '@models/Truck';

const CreateDriver: React.FC = () => {
  const [names, setNames] = useState<string>('');
  const [lastNames, setLastNames] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [license, setLicense] = useState<string>('');
  const [truckSelected, setTruckSelected] = useState<TruckT | null>(null);
  const [roleSelected, setRoleSelected] = useState<TruckT | null>(null);

  const router = useRouter();

  // Mutation para crear un nuevo conductor
  const [createDriver, { isLoading }] = useCreateDriverMutation();

  // queries
  const { currentData: trucks } = useGetAllTrucksQuery({});
  const { currentData: roles } = useGetAllRolesQuery({});

  const handleSubmit = async () => {
    if (!names || !lastNames || !email || !telephone || !license) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const driverDetails = {
      names,
      lastNames,
      email: email.toLowerCase(),
      telephone,
      license,
      truckId: truckSelected?.truckId,
      roleId: roleSelected?.roleId,
    };

    try {
      const response = await createDriver(driverDetails).unwrap();
      console.log('Driver creado exitosamente:', response);
      router.back();
    } catch (error) {
      console.error('Error al crear el conductor:', error);
      alert('Hubo un error al crear el conductor.');
    }
  };

  return (
    <FormScreen
      title="Agregar Piloto"
      onBack={() => router.back()}
      icon={<MaterialIcons name="person-add-alt" size={22} color={theme.colors.white} />}
    >
      <FormInput
        label="Nombres"
        required
        value={names}
        onChangeText={setNames}
        placeholder="Ingrese los nombres"
      />
      <FormInput
        label="Apellidos"
        required
        value={lastNames}
        onChangeText={setLastNames}
        placeholder="Ingrese los apellidos"
      />

      <Text style={styles.label}>Trailer</Text>
      <Dropdown
        items={trucks}
        placeholder="Selecciona una trailer"
        renderItemText={(item) => `${item.plate}`}
        onItemSelected={(item: TruckT) => setTruckSelected(item)}
        linkText="Agregar nuevo trailer"
        onLinkPress={() => console.log('Botón tipo link presionado')}
      />

      <Text style={styles.label}>Rol</Text>
      <Dropdown
        items={roles}
        placeholder="Selecciona una rol"
        renderItemText={(item) => `${item.name}`}
        onItemSelected={(item: any) => setRoleSelected(item)}
      />

      <Space vertical size={16} />

      <FormInput
        label="Correo Electrónico"
        required
        value={email}
        onChangeText={setEmail}
        placeholder="Ingrese el correo electrónico"
        keyboardType="email-address"
      />
      <FormInput
        label="Teléfono"
        required
        value={telephone}
        onChangeText={setTelephone}
        placeholder="Ingrese el teléfono"
        keyboardType="phone-pad"
      />
      <FormInput
        label="Licencia"
        required
        value={license}
        onChangeText={setLicense}
        placeholder="Ingrese el número de licencia"
      />

      <AppButton title="Guardar Conductor" onPress={handleSubmit} loading={isLoading} />
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

export default CreateDriver;
