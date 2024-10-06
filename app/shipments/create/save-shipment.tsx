import { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreateShipmentMutation, useGetAllSipmentsQuery } from "@api/shipmentApi";
import Space from "@components/Space";
import CustomHeader from "@components/CustomHeader";
import StatusIcon from "@components/StatusIcon";
import { useAppSelector } from "@hooks/useRedux";
import { shipmentSelector } from "@slice/shipmentSlice";
import { FontAwesome6 } from "@expo/vector-icons";

type SaveShipmentPropsT = {};

const SaveShipment: FC<SaveShipmentPropsT> = ({}) => {
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [isCreatingShipmentLoading, setCreatingShipmentLoading] = useState(true);

  // hooks
  const router = useRouter();

  // Store
  const shipment = useAppSelector(shipmentSelector);

  // Api calls
    // Mutations
    const [saveShipment] = useCreateShipmentMutation();

  // Effects
  useEffect(() => {
    (async () => {
      await handleCreateShipment();
    })()
  }, []);

  // Functions
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // refetch().finally(() => setRefreshing(false));
  }, []);

  const handleGoTravel = () => {
    router.replace('/shipments/shipment');
  };

  const handleEditShipment = () => {
    router.replace('/shipments/update/modify-shipment');
  };

  const handleCreateShipment = async () => {
    try {
      const newShipment = {
        originId: shipment.origin?.originId,
        destinationId: shipment.destination?.destinationId,
        tenantId: 1,
        containerId: shipment.container?.containerId,
        driverId: shipment.driver?.userId,
        truckId: shipment.truck?.truckId,
        price: shipment.price.amount,
        weight: shipment.weight,
        notes: shipment.notes,
        shipmentStatusId: 1,
        statusUpdated: new Date(),
        currencyId: shipment.price.currency?.currencyId
      };

      await saveShipment(newShipment)
      setTimeout(() => {
        setCreatingShipmentLoading(false);
      }, 500);
    } catch (error) {
      setCreatingShipmentLoading(false);
      console.log('error ', error)
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#5db075'
      }}
    >
      <View
        style={{
          padding: 15,
          flex: 1,
          justifyContent: 'center'
        }}
      >
        <View style={{ padding: 30, backgroundColor: '#fff', borderRadius: 10 }}>
          <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            backgroundColor: '#fff',
          }}>
            <TouchableOpacity style={{
              borderRadius: 50,
              padding: 25,
              backgroundColor: '#79c08e9e'
            }}>
              <FontAwesome6 name='truck-front' size={50} color='#5db075' />
            </TouchableOpacity>
            <Space vertical size={15} />
          </View>
          <Text style={{ color: '#5db075', fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
            {isCreatingShipmentLoading ? 'Viaje Creado' : 'Creando Viaje'}
          </Text>
          {
            isCreatingShipmentLoading
              ? <ActivityIndicator />
              :
              <>
                <Text style={{ fontSize: 15, textAlign: 'center' }}>Se ha creado un nuevo viaje:</Text>
                <Space vertical size={25} />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>Cliente:</Text>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>{shipment.client?.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>Destino:</Text>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>{shipment.destination?.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>Contenedor:</Text>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>{shipment.container?.containerNumber}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>Piloto:</Text>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>{`${shipment.driver?.names} ${shipment.driver?.lastNames}`}</Text>
                </View>
                <Space vertical size={15} />
                <View style={{
                  backgroundColor: '#5db075',
                  borderRadius: 35,
                  paddingVertical: 15
                }}>
                  <Pressable onPress={handleEditShipment}>
                    <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>Editar</Text>
                  </Pressable>
                </View>
                <Space vertical size={15} />
                <Pressable onPress={handleGoTravel}>
                  <Text style={{ color: '#5db075', fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Ir a Viajes</Text>
                </Pressable>
              </>
          }
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#97bea370",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    bottom: 30,
    right: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
});

export default SaveShipment;
