// app/shipment/[id].tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Space from '@components/Space';
import IconMapper from '@components/IconMapper';
import { statusMapper } from 'utils/common/statusMapper';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import { useGetShipmentByIdQuery, useUpdateShipmentMutation } from '@api/shipmentApi';
import CustomAlert from '@components/CustomAlert';
import { useLazyGetAllShipmentsStatusQuery } from '@api/shipmentStatusApi';

const ShipmentView = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  // mutations
  const [modifyShipment] = useUpdateShipmentMutation();

  // queries
  const { data: shipment, isLoading, isError, error } = useGetShipmentByIdQuery(id);
  console.log('ship ', shipment)
  console.log('ship error ', error)
  const [
    trigger,
    { data: shipmentStatusResp, isLoading: isLoadingSS, isError: isErrorSS, error: errorSS },
  ] = useLazyGetAllShipmentsStatusQuery();

  // hooks
  const router = useRouter();

  const {
    container,
    weight,
    price,
    origin,
    destination,
    client,
    shipmentStatus,
    user: driver,
    truck,
    notes,
  } = shipment ?? {};
  console.log('shipment ', shipment);

  const handleEdit = () => {
    router.push({
      pathname: `/shipments/edit/[id]`,
      params: { id, shipment: JSON.stringify(shipment) },
    });
  };

  const updateShipment = async () => {
    try {
      const [shipmentStatusResponse] = (await trigger({ search: description }).unwrap()) ?? [];

      if (!shipmentStatusResponse) {
        alert('No se encontró logro cancelar el viaje.');
        return;
      }

      const updatedShipment = {
        shipmentStatusId: shipmentStatusResponse?.shipmentStatusId,
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

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <Space vertical size={15} />
        <CustomHeader
          title="Viaje"
          color="#fff"
          backgroundColor="#71a780"
          onBackPress={() => {
            router.back();
          }}
          showEditButton={true}
          onEditPress={handleEdit}
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
        <Space vertical size={20} />
        <View
          style={{
            backgroundColor: '#88c69a',
            marginHorizontal: 20,
            padding: 20,
            borderRadius: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <View>
            <Text style={{ color: '#fff' }}>No. Contenedor</Text>
            <Space vertical size={20} />
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20 }}>
              {container?.containerNumber}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff' }}>Estado</Text>
            <Space vertical size={10} />
            <IconMapper
              {...statusMapper[shipmentStatus?.description?.toLowerCase() || '']}
              size={24}
              color="#fff"
            />
            <Space vertical size={10} />
            <Text
              style={{
                color: '#fff', //statusMapper[shipmentStatus?.description?.toLowerCase() || '']?.color || '#000',
                fontWeight: '900',
              }}
            >
              {shipmentStatus?.description?.toUpperCase()}
            </Text>
          </View>
        </View>
        <Space vertical size={20} />
        <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            {!['CANCELADO', 'ELIMINADO', 'FINALIZADO', 'COBRADO', 'RUTA', 'ENTREGADO'].includes(
              shipmentStatus?.description?.toUpperCase(),
            ) && (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => {
                  setDescription('CANCELADO');
                  setAlertVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Cancelar Viaje</Text>
              </TouchableOpacity>
            )}
            {['CANCELADO'].includes(shipmentStatus?.description?.toUpperCase()) && (
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: '#ff8e00cf' }]}
                onPress={() => {
                  setDescription('CREADO');
                  setAlertVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Reanudar Viaje</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ width: '50%' }}>
            <TouchableOpacity style={styles.createButton} onPress={handleEdit}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Space vertical size={70} />
        <ScrollView style={styles.container}>
          <View style={styles.card}>
            <View style={[styles.row, { justifyContent: 'space-around' }]}>
              <View>
                <Text style={styles.label}>No. Contenedor</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{container?.containerNumber || 'N/A'}</Text>
              </View>
              <View></View>
              <View>
                <Text style={styles.label}>Peso</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{weight} kg</Text>
              </View>
            </View>
            <Space vertical size={10} />
            <View
              style={{
                marginLeft: 22,
              }}
            >
              <Text style={styles.label}>Precio</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>{`${price ?? ''}`}</Text>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Origen</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{origin?.name || 'N/A'}</Text>
                <Text style={styles.text}>{origin?.address || 'N/A'}</Text>
              </View>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Destino</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{destination?.name || 'N/A'}</Text>
                <Text style={styles.text}>{destination?.address || 'N/A'}</Text>
              </View>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Piloto</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{`${driver?.names} ${driver?.lastNames}` || 'N/A'}</Text>
              </View>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Camión</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{truck?.plate || 'N/A'}</Text>
              </View>
              <Space vertical size={10} />
              <Text style={styles.label}>Notas</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>{notes || 'Sin notas adicionales'}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
    // </View>
  );
};

export default ShipmentView;

const styles = StyleSheet.create({
  upperBackground: {
    flex: 1,
    // backgroundColor: '#6200EE',
    borderBottomLeftRadius: 200, // Bordes redondeados
    borderBottomRightRadius: 50,
    zIndex: 1, // Asegura que esté detrás del contenido
  },
  lowerBackground: {
    flex: 1,
    // backgroundColor: '#BB86FC',
    borderTopLeftRadius: -10, // Bordes redondeados
    borderTopRightRadius: 60,
    marginTop: 100, // Superpone la parte inferior con el color superior
  },
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
    padding: 10,
    zIndex: 2,
  },
  card: {
    // backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    color: '#5db075',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#2073cdbd',
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#ff0809bd',
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    color: '#333',
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
