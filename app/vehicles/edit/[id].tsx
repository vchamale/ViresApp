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
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { useUpdateTruckMutation } from "@api/truckApi";
import CustomAlert from "@components/CustomAlert";
import Dropdown from "@components/Dropdown";
import { useGetAllMakeQuery, useGetAllModelsByMakeIdQuery } from "@api/makeApi";
import { skipToken } from "@reduxjs/toolkit/query";

const EditVehicle: React.FC = () => {
  const { vehicle, id } = useLocalSearchParams();
  const parsedVehicle = JSON.parse(vehicle as string);

  const [plate, setPlate] = useState<string>("");
  const [vin, setVin] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [makeSelected, setMakeSelected] = useState({});
  const [modelSelected, setModelSelected] = useState(null);

  const router = useRouter();

  // mutations

  const [updateVehicle] = useUpdateTruckMutation();

  // Querys

  const { data: makeList, isLoading: isMakeLoading, isError: isMakeError} = useGetAllMakeQuery({});
  const { data: modelList, isLoading: isModelLoading, isError: isModelError} = useGetAllModelsByMakeIdQuery(makeSelected?.makeId ? { id: makeSelected.makeId } : skipToken);

  useEffect(() => {
    if (parsedVehicle) {
      setPlate(parsedVehicle.plate);
      setVin(parsedVehicle.vin);
      setYear(parsedVehicle.year);
    }
  }, []);

  useEffect(() => {
    if (parsedVehicle && makeList?.length > 0) {
      const make = makeList?.find((make: any) => parsedVehicle.model.makeId === make.makeId)
      setMakeSelected(make);
      setModelSelected(parsedVehicle.model);
    }
  }, [makeList]);

  useEffect(() => {
    setIsModified(plate !== parsedVehicle.plate || vin !== parsedVehicle.vin || year !== parsedVehicle.year || modelSelected?.name !== parsedVehicle.model.name);
  }, [plate, vin, year, modelSelected?.name, parsedVehicle.plate, parsedVehicle.vin, parsedVehicle.year, parsedVehicle.model.name]);

  const handleSubmit = () => {
    if (!plate || !vin || !year || !modelSelected?.name) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    setAlertVisible(true)
  };

  const handleUpdateVehicle = async () => {
    try {
      console.log({ id, body: { plate, vin, year, model: modelSelected } })
      const response = await updateVehicle({ id, body: { plate, vin, year, modelId: modelSelected?.modelId } }).unwrap();
      console.log('Vehicle updated successfully:', response);
      setAlertVisible(false);
      router.back();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Hubo un error al actualizar el punto de partida.');
    }
  };

  const handleMakeSelected = (item: any) => {
    setMakeSelected(item);
    setModelSelected(null);
  }
  const handleModelSelected = (item: any) => {
    setModelSelected(item);
  }

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Editar Vehículo"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />
        <CustomAlert
          isVisible={isAlertVisible}
          title="Estas seguro de modificar?"
          titleColor="#ff0809bd"
          text="Estas a punto de modificar el vehiculo, deseas continuar?"
          onClose={() => { setAlertVisible(false) }}
          buttons={[
            <Pressable onPress={() => { setAlertVisible(false) }}>
              <View style={styles.cancelButtonAlert}>
                <Text style={styles.cancelButtonTextAlert}>Cancelar</Text>
              </View>
            </Pressable>,
            <Pressable onPress={() => { 
              handleUpdateVehicle()
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
          <MaterialCommunityIcons name="archive-edit" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <ScrollView style={styles.container}>

          <Text style={styles.label}>Placa</Text>
          <TextInput
            style={styles.input}
            value={plate}
            onChangeText={setPlate}
            placeholder="Ingrese la placa del vehículo"
          />

          <Text style={styles.label}>VIN</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={setVin}
            placeholder="Ingrese el VIN del vehículo"
          />

          <Text style={styles.label}>Año</Text>
          <TextInput
            style={styles.input}
            value={`${year}`}
            onChangeText={setYear}
            placeholder="Ingrese el año del vehículo"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Marca</Text>
          <Dropdown
            items={makeList}
            placeholder="Selecciona una marca"
            placeholderColor='#71a780'
            renderItemText={(item) => `${item?.name}`}
            onItemSelected={(item) => handleMakeSelected(item)}
            initialSelectedItem={makeSelected ?? undefined}
          />

          <Text style={styles.label}>Modelo</Text>
          <Dropdown
            items={modelList}
            placeholder="Selecciona un modelo"
            placeholderColor='#71a780'
            renderItemText={(item) => `${item?.name}`}
            onItemSelected={(item) => handleModelSelected(item)}
            initialSelectedItem={modelSelected ?? undefined}
          />

          <TouchableOpacity style={[
            styles.submitButton,
            !isModified && styles.disabledButton,
            ]} onPress={handleSubmit}
            disabled={!isModified}
            >
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
          <Space vertical size={50} />
        </ScrollView>
        {/* <View style={styles.container}>
        </View> */}
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  disabledButton: {
    backgroundColor: "#9fa8da",
    opacity: 0.7,
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

export default EditVehicle;
