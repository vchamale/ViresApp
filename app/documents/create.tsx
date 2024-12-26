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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCreateDocumentMutation } from "@api/documentApi";

const AddPolicy: React.FC = () => {
  // state
  const [noDocumento, setNoDocumento] = useState<string>("");

  // hooks
  const router = useRouter();

  // mutations
  const [create] = useCreateDocumentMutation()

  // handlers
  const handleSubmit = async () => {
    if (!noDocumento) {
      alert("Por favor ingresa el número de documento");
      return;
    }

    const policyDetails = {
      documentNumber: noDocumento,
    };

    const resp = await create(policyDetails)

    console.log("Detalles de la póliza:", policyDetails, resp);
    router.back();
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Agregar Póliza"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="file-document" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <View style={styles.container}>
          <View>
            <Text style={styles.label}>No. Documento</Text>
            <TextInput
              style={styles.input}
              value={noDocumento}
              onChangeText={setNoDocumento}
              placeholder="Ingrese el número de documento"
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar Póliza</Text>
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

export default AddPolicy;
