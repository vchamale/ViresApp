import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomHeader from "@components/CustomHeader";
import Space from "@components/Space";
import BackgroundView from "@components/BackgroundView";
import CustomAlert from "@components/CustomAlert";
import { useUpdateClientMutation } from "@api/clientApi";
import FontAwesome5 from "@react-native-vector-icons/fontawesome5";

const EditClient: React.FC = () => {
  const { client, id } = useLocalSearchParams(); // Recibe los datos del cliente
  const parsedClient = JSON.parse(client as string);

  const [nit, setNit] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  const router = useRouter();

  const [updateClient] = useUpdateClientMutation();

  useEffect(() => {
    if (parsedClient) {
      setNit(parsedClient.nit);
      setName(parsedClient.name);
      setAddress(parsedClient.address);
      setContactName(parsedClient.contactName);
      setTelephone(parsedClient.telephone);
      setEmail(parsedClient.email);
    }
  }, []);

  useEffect(() => {
    setIsModified(name !== parsedClient.name || address !== parsedClient.address || nit !== parsedClient.nit || contactName !== parsedClient.contactName || telephone !== parsedClient.telephone || email !== parsedClient.email);
  }, [name, address, nit, contactName, telephone, email, parsedClient.nit, parsedClient.name, parsedClient.address, parsedClient.contactName, parsedClient.telephone, parsedClient.email]);

  const handleSubmit = () => {
    if (!name) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!address) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!nit) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!contactName) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!telephone) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!email) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    setAlertVisible(true)
  };

  const handleUpdateClient = async () => {
    try {
      const response = await updateClient({ id, body: { name, address, nit, contactName, telephone, email } }).unwrap();
      console.log('Client updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Editar Cliente"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <CustomAlert
          isVisible={isAlertVisible}
          title="Estas seguro de modificar?"
          titleColor="#ff0809bd"
          text="Estas a punto de modificar la poliza, deseas continuar?"
          onClose={() => { setAlertVisible(false) }}
          buttons={[
            <Pressable onPress={() => { setAlertVisible(false) }}>
              <View style={styles.cancelButtonAlert}>
                <Text style={styles.cancelButtonTextAlert}>Cancelar</Text>
              </View>
            </Pressable>,
            <Pressable onPress={() => { 
              handleUpdateClient()
              setAlertVisible(false) 
              }}>
              <View style={styles.continueButtonAlert}>
                <Text style={styles.continueButtonTextAlert}>Modificar</Text>
              </View>
            </Pressable>
          ]}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <FontAwesome5 name="user-plus" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <ScrollView style={styles.container}>
          <Text style={styles.label}>NIT</Text>
          <TextInput
            style={styles.input}
            value={nit}
            onChangeText={setNit}
            placeholder="Ingrese el NIT"
          />

          <Text style={styles.label}>Nombre</Text>
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

          <Text style={styles.label}>Contacto</Text>
          <TextInput
            style={styles.input}
            value={contactName}
            onChangeText={setContactName}
            placeholder="Ingrese el nombre del contacto"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            placeholder="Ingrese el teléfono"
          />

          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Ingrese el correo electrónico"
          />

          <TouchableOpacity style={[
            styles.submitButton,
            !isModified && styles.disabledButton,
            ]} onPress={handleSubmit}
            disabled={!isModified}
            >
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
          <Space vertical size={30} />
        </ScrollView>
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
  disabledButton: {
    backgroundColor: "#9fa8da",
    opacity: 0.7,
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
  cancelButtonAlert: {
    backgroundColor: "#ff0809bd",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginTop: 20,
  },
  cancelButtonTextAlert: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  continueButtonAlert: {
    backgroundColor: "#3f51b5",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginTop: 20,
  },
  continueButtonTextAlert: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default EditClient;
