import { FC, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCreateShipmentMutation } from '@api/shipmentApi';
import Space from '@components/Space';
import { useAppSelector } from '@hooks/useRedux';
import { shipmentSelector } from '@slice/shipmentSlice';
import { FontAwesome6 } from '@expo/vector-icons';

type SaveShipmentPropsT = {};

const SaveShipment: FC<SaveShipmentPropsT> = ({}) => {
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [isCreatingShipmentLoading, setCreatingShipmentLoading] = useState(true);
  const [shipmentId, setShipmentId] = useState<number | null>(null);
  const [newShipment, setNewShipment] = useState<number | null>(null);

  const { shipment: stringShipment } = useLocalSearchParams(); // Recibe los datos del envío como string

  console.log('string ship ', stringShipment);
  const shipment = JSON.parse(stringShipment as string);
  console.log('parse ship ', shipment);

  // hooks
  const router = useRouter();

  // Api calls
  // Mutations
  const [saveShipment] = useCreateShipmentMutation();

  // Effects
  useEffect(() => {
    (async () => {
      await handleCreateShipment();
    })();
  }, []);

  // Functions
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // refetch().finally(() => setRefreshing(false));
  }, []);

  const handleGoTravel = () => {
    router.replace('/(tabs)/shipment');
  };

  const handleEditShipment = (id: number) => {
    router.push({
      pathname: `/shipments/edit/[id]`,
      params: { id: shipmentId, snapshot: JSON.stringify(newShipment) },
    })
  };

  const handleCreateShipment = async () => {
    console.log('shipment ', shipment.container);

    try {
      const newShipment = {
        originId: shipment?.originId,
        clientId: shipment?.clientId,
        destinationId: shipment?.destinationId,
        documentNumber: shipment.documentNumber,
        container: shipment?.container,
        driverId: shipment.driverId,
        truckId: shipment?.truckId,
        sizeId: shipment?.sizeId,
        price: shipment.price,
        weight: shipment.weight,
        notes: shipment.notes,
        shipmentStatusId: 1,
        dateCreated: new Date(),
        currencyId: shipment.currencyId,
      };

      console.log('newShipment ', newShipment);

      // return

      const { data, error } = await saveShipment(newShipment);
      

      if (error) {
        Alert.alert('Algo ocurrio', 'Favor intentar mas tarde', [
        {  
          text: 'Aceptar',
          onPress: () => router.replace('/(tabs)'),
        },
        ])
      }

      setShipmentId(data.create_new_shipment as number);
      setNewShipment(newShipment);
      setTimeout(() => {
        setCreatingShipmentLoading(false);
      }, 500);
    } catch (error) {
      setCreatingShipmentLoading(false);
      console.log('error ', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#71a780',
      }}
    >
      <View
        style={{
          padding: 15,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View style={{ padding: 30, backgroundColor: '#fff', borderRadius: 10 }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              backgroundColor: '#fff',
            }}
          >
            <TouchableOpacity
              style={{
                borderRadius: 50,
                padding: 25,
                backgroundColor: '#79c08e9e',
              }}
            >
              <FontAwesome6 name="truck-front" size={50} color="#71a780" />
            </TouchableOpacity>
            <Space vertical size={15} />
          </View>
          <Text
            style={{
              color: '#71a780',
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {isCreatingShipmentLoading ? 'Viaje Creado' : 'Creando Viaje'}
          </Text>
          {isCreatingShipmentLoading ? (
            <ActivityIndicator color="#71a780" size={100} />
          ) : (
            <>
              <Text style={{ fontSize: 15, textAlign: 'center' }}>
                Se ha creado un nuevo viaje
              </Text>
              <Space vertical size={40} />
              <View
                style={{
                  backgroundColor: '#5db075',
                  borderRadius: 35,
                  paddingVertical: 15,
                }}
              >
                <Pressable onPress={handleEditShipment}>
                  <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>Editar</Text>
                </Pressable>
              </View>
              <Space vertical size={15} />
              <Pressable onPress={handleGoTravel}>
                <Text
                  style={{
                    color: '#5db075',
                    fontSize: 15,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Ir a Viajes
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#97bea370',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    right: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default SaveShipment;
