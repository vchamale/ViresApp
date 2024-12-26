import React, { FC, useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import CustomHeader from "@components/CustomHeader";
import Space from "@components/Space";
import SearchBox from "@components/SearchBox";

const ClientList: FC = () => {
  // Estado
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clients, setClients] = useState<any[]>([
    {
      address: "Direccion de Prueba 1",
      clientId: 1,
      contactName: "Contacto 1",
      email: "testemail@test.com",
      name: "Cliente de Prueba 1",
      nit: "123456789",
      status: true,
      telephone: "123456789",
      tenant: {
        tenantName: "ViresApp",
      },
    },
  ]);

  // Hooks
  const router = useRouter();

  // Funciones
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulación de una llamada a API
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleSearch = () => {
    // Lógica de búsqueda simulada
    console.log("Buscando clientes con el término:", searchTerm);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.clientCard}
      onPress={() =>
        router.push({
          pathname: `/clients/[id]`,
          params: { id: item.clientId, client: JSON.stringify(item) },
        })
      }
    >
      <Text style={styles.clientName}>{item.name}</Text>
      <Text style={styles.clientInfo}>NIT: {item.nit}</Text>
      <Text style={styles.clientInfo}>Teléfono: {item.telephone}</Text>
      <Text style={styles.clientInfo}>Correo: {item.email}</Text>
      <Text style={styles.clientInfo}>Dirección: {item.address}</Text>
      <Text style={styles.clientInfo}>
        Estado: {item.status ? "Activo" : "Inactivo"}
      </Text>
      <Text style={styles.clientInfo}>Tenant: {item.tenant?.tenantName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader
          title="Clientes"
          onBackPress={() => router.back()}
          showHelpButton={true}
        />
        <Space vertical size={15} />
        <Text style={{ color: "#5db075", fontWeight: "700" }}>Buscar Cliente</Text>
        <Space vertical size={5} />
        <SearchBox
          iconName="search"
          placeholder="Buscar cliente por nombre, NIT o correo"
          iconColor="#5db075"
          placeholderTextColor="#5db07587"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Space vertical size={15} />
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%", paddingRight: 10 }}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/clients/create-client")}
            >
              <Text style={styles.buttonText}>Nuevo Cliente</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "50%" }}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Space vertical size={15} />
        <FlatList
          data={clients}
          keyExtractor={(item) => item.clientId.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    marginTop: 10,
  },
  clientCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  clientInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  searchButton: {
    backgroundColor: "#5db075",
    paddingVertical: 10,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ClientList;
