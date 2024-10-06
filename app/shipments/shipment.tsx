import { FC, useCallback, useState } from "react";
import {
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
import { useGetAllSipmentsQuery } from "@api/shipmentApi";
import Space from "@components/Space";
import CustomHeader from "@components/CustomHeader";
import StatusIcon from "@components/StatusIcon";

type ShipmentPropsT = {};

const Shipment: FC<ShipmentPropsT> = ({}) => {
  // State
  const [refreshing, setRefreshing] = useState(false);

  // hooks
  const router = useRouter();

  // Api calls
  const {
    data: shipments,
    isLoading,
    isError,
    refetch,
  } = useGetAllSipmentsQuery({});

  // Functions
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error loading shipments</Text>
      </View>
    );
  }

  console.log('shipments ', shipments)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff'
      }}
    >
      <View
        style={{
          padding: 15,
          flex: 1
        }}
      >
        <CustomHeader
          title={'Viajes'} 
          onBackPress={() => {
            router.back();
          }}
          showHelpButton={true}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            data={shipments}
            keyExtractor={(item) => item.shipmentId.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <StatusIcon status={item.shipmentStatus?.description} />
                <Space vertical size={10} />
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.container.containerNumber}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold' }}>Origen:</Text>
                  <Space horizontal size={5} />
                  <Text>{item.origin?.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold' }}>Destino:</Text>
                  <Space horizontal size={5} />
                  <Text>{item.destination?.name}</Text>
                </View>

                <Text>
                  Driver: {item.user?.names} {item.user?.last_names}
                </Text>
                <Text>Truck Plate: {item.truck?.plate}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // router.push("/shipments/create-shipment");
          router.push("/shipments/create/add-shipment-client");
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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

export default Shipment;
