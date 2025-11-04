import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import BackgroundView from '@components/BackgroundView';
import Dropdown from '@components/Dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomAlert from '@components/CustomAlert';
import { useUpdateShipmentMutation } from '@api/shipmentApi';
import { useGetAllShipmentsStatusQuery } from '@api/shipmentStatusApi';
import { useGetAllOriginsQuery } from '@api/originApi';
import { useGetAllDestinationsQuery } from '@api/destinationApi';
import { useGetAllClientsQuery } from '@api/clientApi';
import { useGetAllTrucksQuery } from '@api/truckApi';
import { useGetAllDriversQuery } from '@api/driverApi';
import { formatNumber } from 'utils/formatNumber';
import CurrencyInput from "react-native-currency-input";

const EditShipment: React.FC = () => {
  const { shipment, id } = useLocalSearchParams(); // Recibe los datos del envío como string
  const parsedShipment = JSON.parse(shipment as string);

  const [containerNumber, setContainerNumber] = useState<string>('');
  const [weight, setWeight] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [client, setClient] = useState<string>('');
  const [driver, setDriver] = useState<string>('');
  const [vehicle, setVehicle] = useState<string>('');
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [shipmentStatusSelected, setShipmentStatusSelected] = useState(null);
  const [originSelected, setOriginSelected] = useState(null);
  const [destinationSelected, setDestinationSelected] = useState(null);
  const [clientSelected, setClientSelected] = useState(null);
  const [vehicleSelected, setVehicleSelected] = useState(null);
  const [driverSelected, setDriverSelected] = useState(null);

  const router = useRouter();

  // mutations
  const [modifyShipment] = useUpdateShipmentMutation();

  // Queries
  const {
    data: shipmentStatusList,
    isLoading: isShipmentStatusLoading,
    isError: isShipmentStatusError,
  } = useGetAllShipmentsStatusQuery({});
  const {
    data: originList,
    isLoading: isOriginLoading,
    isError: isOriginError,
  } = useGetAllOriginsQuery({ clientId: parsedShipment.clientId });

  const {
    data: destinationList,
    isLoading: isDestinationLoading,
    isError: isDestinationError,
  } = useGetAllDestinationsQuery({ clientId: parsedShipment.clientId });

  const {
    data: vehicleList,
    isLoading: isVehicleLoading,
    isError: isVehicleError,
    error
  } = useGetAllTrucksQuery({});

  // console.log('destinationList ', vehicleList)
  // console.log('err ', error)


  const {
    data: driverList,
    isLoading: isdriverLoading,
    isError: isdriverError,
  } = useGetAllDriversQuery({});

  // Inicializar los valores con los datos existentes del envío
  useEffect(() => {
    if (parsedShipment) {
      setContainerNumber(parsedShipment.container?.containerNumber || '');
      setWeight(parsedShipment.weight?.toString() || '');
      setPrice(parsedShipment.price?.toString() || '');
    }
  }, [parsedShipment]);

  useEffect(() => {
    if (parsedShipment && shipmentStatusList?.length > 0) {
      const shipmentStatus = shipmentStatusList?.find(
        (shipmentStatus: any) =>
          parsedShipment.shipmentStatusId === shipmentStatus.shipmentStatusId,
      );
      setShipmentStatusSelected(shipmentStatus);
    }
  }, [shipmentStatusList]);

  useEffect(() => {
    if (parsedShipment && originList?.length > 0) {
      const origin = originList?.find((origin: any) => parsedShipment.originId === origin.originId);
      setOriginSelected(origin);
    }
  }, [originList]);

  useEffect(() => {
    if (parsedShipment && destinationList?.length > 0) {
      const destination = destinationList?.find(
        (destination: any) => parsedShipment.destinationId === destination.destinationId,
      );
      setDestinationSelected(destination);
    }
  }, [destinationList]);

  // useEffect(() => {
  //   if (parsedShipment && clientList?.length > 0) {
  //     const client = clientList?.find((client: any) => parsedShipment.clientId === client.clientId)
  //     setClientSelected(client);
  //   }
  // }, [clientList]);

  useEffect(() => {
    if (parsedShipment && vehicleList?.length > 0) {
      const vehicle = vehicleList?.find((truck: any) => parsedShipment.truckId === truck.truckId);
      setVehicleSelected(vehicle);
    }
  }, [vehicleList]);

  useEffect(() => {
    if (parsedShipment && driverList?.length > 0) {
      const driver = driverList?.find(
        (driver: any) => parsedShipment.user?.userId === driver.userId,
      );
      setDriverSelected(driver);
    }
  }, [vehicleList]);

  useEffect(() => {
    setIsModified(
      containerNumber !== parsedShipment.container?.containerNumber ||
        shipmentStatusSelected?.shipmentStatusId !==
          parsedShipment.shipmentStatus?.shipmentStatusId ||
        originSelected?.originId !== parsedShipment.origin?.originId ||
        destinationSelected?.destinationId !== parsedShipment.destination?.destinationId ||
        vehicleSelected?.truckId !== parsedShipment.truck?.truckId ||
        driverSelected?.userId !== parsedShipment.user?.userId ||
        price !== parsedShipment.price ||
        weight !== parsedShipment.weight,
    );
  }, [
    containerNumber,
    parsedShipment.container?.containerNumber,
    shipmentStatusSelected?.shipmentStatusId,
    parsedShipment.shipmentStatus?.shipmentStatusId,
    originSelected?.originId,
    parsedShipment.origin?.originId,
    destinationSelected?.destinationId,
    parsedShipment.destination?.destinationId,
    vehicleSelected?.truckId,
    parsedShipment.truck?.truckId,
    driverSelected?.userId,
    parsedShipment.user?.userId,
    price,
    parsedShipment.price,
    weight,
    parsedShipment.weight,
  ]);

  const handleSubmit = () => {
    if (
      !containerNumber ||
      !weight ||
      !price ||
      !shipmentStatusSelected?.shipmentStatusId ||
      !originSelected?.originId ||
      !destinationSelected?.destinationId ||
      !vehicleSelected?.truckId
    ) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setAlertVisible(true);
  };

  const updateShipment = async () => {
    try {
      const updatedShipment = {
        containerNumber,
        weight: parseFloat(weight),
        price: parseFloat(price),
        shipmentStatus: shipmentStatusSelected?.shipmentStatusId,
        origin: originSelected?.originId,
        destination: destinationSelected?.destinationId,
        driver: driverSelected?.userId,
        truck: vehicleSelected?.truckId,
      };
      console.log('Envío actualizado:', updatedShipment);

      const response = await modifyShipment({ id, body: updatedShipment }).unwrap(); // unwrap para manejar errores
      console.log('Shipment updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating shipment:', error);
      alert('Hubo un error al actualizar el shipmento.');
    }
  };

  const handleShipmentStatusSelected = (item: any) => {
    setShipmentStatusSelected(item);
  };

  const handleOriginSelected = (item: any) => {
    setOriginSelected(item);
  };

  const handleDestinationSelected = (item: any) => {
    setDestinationSelected(item);
  };

  const handleVehicleSelected = (item: any) => {
    setVehicleSelected(item);
  };

  const handleDriverSelected = (item: any) => {
    setDriverSelected(item);
  };

  const handleChange = (setter: (v: string) => void) => (text: string) => {
    const clean = text.replace(/[^0-9.]/g, "");
    setter(clean);
  };

  const handleBlur = (setter: (v: string) => void, value: string) => {
    setter(formatNumber(value));
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <Space vertical size={15} />
        <CustomHeader
          title="Editar Envío"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <CustomAlert
          isVisible={isAlertVisible}
          title="Estas seguro de modificar?"
          titleColor="#ff0809bd"
          text="Estas a punto de modificar este viaje, deseas continuar?"
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
                updateShipment();
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
        <ScrollView style={styles.container}>
          <Text style={styles.label}>No. Contenedor</Text>
          <TextInput
            editable={false}
            style={styles.disabledInput}
            value={containerNumber}
            onChangeText={setContainerNumber}
            placeholder="Ingrese el número del contenedor"
          />

          <Text style={styles.label}>Estado</Text>
          <Dropdown
            items={shipmentStatusList}
            renderItemText={(item) => `${item?.description}`}
            onItemSelected={(item) => handleShipmentStatusSelected(item)}
            placeholder="Selecciona un estado"
            initialSelectedItem={shipmentStatusSelected ?? undefined}
          />

          <Text style={styles.label}>Origen</Text>
          <Dropdown
            items={originList}
            renderItemText={(item) => `${item?.name}`}
            onItemSelected={(item) => handleOriginSelected(item)}
            placeholder="Selecciona punto de partida"
            initialSelectedItem={originSelected ?? undefined}
          />

          <Text style={styles.label}>Destino</Text>
          <Dropdown
            items={destinationList}
            renderItemText={(item) => `${item?.name}`}
            onItemSelected={(item) => handleDestinationSelected(item)}
            placeholder="Selecciona destino"
            initialSelectedItem={destinationSelected ?? undefined}
          />

          <Text style={styles.label}>Piloto</Text>
          <Dropdown
            items={driverList}
            placeholder="Selecciona un piloto"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item?.names}`}
            onItemSelected={(item) => handleDriverSelected(item)}
            initialSelectedItem={driverSelected ?? undefined}
          />

          <Text style={styles.label}>Vehiculo</Text>
          <Dropdown
            items={vehicleList}
            placeholder="Selecciona un vehiculo"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item?.plate}`}
            onItemSelected={(item) => handleVehicleSelected(item)}
            initialSelectedItem={vehicleSelected ?? undefined}
          />

          <Text style={styles.label}>Peso (Kg)</Text>
          <CurrencyInput
            value={weight}
            onChangeValue={setWeight}
            delimiter=","
            separator="."
            precision={2}
            placeholder="Ingrese el peso"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Text style={styles.label}>Precio</Text>
          <CurrencyInput
            value={price}
            onChangeValue={setPrice}
            prefix="Q "
            delimiter=","
            separator="."
            precision={2}
            placeholder="Ingrese el precio"
            // keyboardType="decimal-pad"
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.submitButton, !isModified && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!isModified}
          >
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
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
    color: '#5db075',
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
  disabledInput: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#dcdcdcff',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    marginBottom: 50,
    borderRadius: 4,
    marginTop: 20,
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
  disabledButton: {
    backgroundColor: '#9fa8da',
    opacity: 0.7,
  },
});

export default EditShipment;
