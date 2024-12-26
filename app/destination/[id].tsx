import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Space from "@components/Space";
import CustomHeader from "@components/CustomHeader";
import BackgroundView from "@components/BackgroundView";
import { useGetDestinationsByIdQuery } from "@api/destinationApi";

const DestinationView = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const router = useRouter();

  const { data: destination, isLoading, isError } = useGetDestinationsByIdQuery(id);

  const handleEdit = () => {
    router.push({
      pathname: `/destination/edit/[id]`,
      params: { id, destination: JSON.stringify(destination) }
    })
  }

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <Space vertical size={15} />
        <CustomHeader
          title="Destino"
          color="#fff"
          backgroundColor="#71a780"
          onBackPress={() => {
            router.back();
          }}
          onEditPress={handleEdit}
          showEditButton={true}
        />
        <Space vertical size={20} />
        <ScrollView style={styles.container}>
          <View style={styles.card}>
            <View style={[styles.row]}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.text}>{destination?.name || "N/A"}</Text>
            </View>
            <Space vertical size={10} />
            <View style={styles.row}>
              <Text style={styles.label}>Dirección</Text>
              <Text style={styles.text}>{destination?.address || "N/A"}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', paddingHorizontal: 0 }}>
            <View style={{ width: '50%' }} />
            <View style={{ width: '50%' }}>
              <TouchableOpacity style={styles.createButton} onPress={handleEdit}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

export default DestinationView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontWeight: "700",
    color: "#5db075",
    fontSize: 14,
  },
  createButton: {
    backgroundColor: "#2073cdbd",
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: 'center',
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});
