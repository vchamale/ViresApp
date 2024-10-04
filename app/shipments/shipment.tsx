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

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          padding: 15,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 45,
              fontWeight: "condensedBold",
            }}
          >
            Viajes
          </Text>
          <Space vertical size={35} />
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <Text
              style={{
                color: "#5db075",
                fontSize: 25,
              }}
            >
              Atras
            </Text>
          </Pressable>
          <FlatList
            data={shipments}
            keyExtractor={(item) => item.shipment_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>Shipment #{item.shipment_id}</Text>
                <Text>Status: {item.shipment_status?.description}</Text>
                <Text>Origin: {item.origin?.name}</Text>
                <Text>Destination: {item.destination?.name}</Text>
                <Text>
                  Driver: {item.driver?.names} {item.driver?.last_names}
                </Text>
                <Text>Truck Plate: {item.truck?.plate}</Text>
                <Text>Price: Q{item.price}</Text>
                <Text>Weight: {item.weight} kg</Text>
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
          router.navigate("./shipments/create-shipment");
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
    backgroundColor: "#f9f9f9",
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
