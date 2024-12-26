import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import CustomHeader from "@components/CustomHeader";
import Space from "@components/Space";
import BackgroundView from "@components/BackgroundView";
import { MaterialIcons } from "@expo/vector-icons";
import { useCreateDestinationMutation } from "@api/destinationApi";
import Dropdown from "@components/Dropdown";
import { useGetAllClientsQuery } from "@api/clientApi";

const CreateDestination: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [clientSelected, setClientSelected] = useState(null);

  const router = useRouter();

  // mutations

  const [create] = useCreateDestinationMutation()

  const { data: clientList, isLoading: isMakeLoading, isError: isMakeError} = useGetAllClientsQuery({});

  const handleSubmit = async () => {
    if (!name || !address || !clientSelected) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const destinationDetails = {
      name,
      address,
      clientId: clientSelected?.clientId
    };

    console.log("Detalles del punto de partida:", destinationDetails);

    // Simulación de envío de datos
    const resp = await create(destinationDetails);
    console.log('resp ', resp)
    router.back();
  };

  const handleClientSelected = (item: any) => {
    setClientSelected(item);
  }

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Agregar Destino"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MaterialIcons name="add-location-alt" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <View style={styles.container}>
          <View>
            <Text style={styles.label}>Cliente</Text>
            <Dropdown
              items={clientList}
              placeholder="Selecciona un cliente"
              placeholderColor='#71a780'
              renderItemText={(item) => `${item?.name}`}
              onItemSelected={(item) => handleClientSelected(item)}
              initialSelectedItem={clientSelected ?? undefined}
            />
            <Text style={styles.label}>Lugar (Nombre)</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ingrese el nombre"
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Ingrese la dirección"
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar Destino</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#71a780",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: "#3f51b5",
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CreateDestination;
