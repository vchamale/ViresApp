import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import CustomHeader from "@components/CustomHeader";
import Space from "@components/Space";
import BackgroundView from "@components/BackgroundView";
import Dropdown from "@components/Dropdown";

const EditShipment: React.FC = () => {
  const { shipment } = useSearchParams(); // Recibe los datos del envío como string
  const parsedShipment = JSON.parse(shipment as string);

  const [containerNumber, setContainerNumber] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const router = useRouter();

  // Inicializar los valores con los datos existentes del envío
  useEffect(() => {
    if (parsedShipment) {
      setContainerNumber(parsedShipment.container?.containerNumber || "");
      setOrigin(parsedShipment.origin?.name || "");
      setDestination(parsedShipment.destination?.name || "");
      setWeight(parsedShipment.weight?.toString() || "");
      setStatus(parsedShipment.shipmentStatus?.description || "");
    }
  }, [parsedShipment]);

  const handleSubmit = () => {
    if (!containerNumber || !origin || !destination || !weight || !status) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const updatedShipment = {
      containerNumber,
      origin,
      destination,
      weight: parseFloat(weight),
      status,
    };

    console.log("Envío actualizado:", updatedShipment);

    // Simulación de envío de datos
    alert("Envío actualizado correctamente");
    router.back();
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Editar Envío"
          backgroundColor="#5db075"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <Space vertical size={20} />
        <View style={styles.container}>
          <Text style={styles.label}>No. Contenedor *</Text>
          <TextInput
            style={styles.input}
            value={containerNumber}
            onChangeText={setContainerNumber}
            placeholder="Ingrese el número del contenedor"
          />

          <Text style={styles.label}>Origen *</Text>
          <TextInput
            style={styles.input}
            value={origin}
            onChangeText={setOrigin}
            placeholder="Ingrese el origen"
          />

          <Text style={styles.label}>Destino *</Text>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            placeholder="Ingrese el destino"
          />

          <Text style={styles.label}>Peso (Kg) *</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Ingrese el peso"
          />

          <Text style={styles.label}>Estado *</Text>
          <Dropdown
            items={[
              { label: "En Proceso", value: "En Proceso" },
              { label: "Entregado", value: "Entregado" },
              { label: "Cancelado", value: "Cancelado" },
            ]}
            selectedValue={status}
            onValueChange={(value) => setStatus(value)}
            placeholder="Selecciona el estado"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
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
    fontWeight: "bold",
    color: "#5db075",
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

export default EditShipment;
