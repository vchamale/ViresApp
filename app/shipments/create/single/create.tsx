import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@hooks/useRedux";
import {
  shipmentSelector,
  addClient,
  addShipmentRoute,
  addContainerDetails,
  addTransportDetails,
  addOrigin,
  addDestination,
  addContainer,
  addPolicy,
  addWeight,
  addPrice,
  addCurrency,
  addDriver,
  addTruck,
  addNotes,
  reset,
} from "@slice/shipmentSlice";
import Dropdown from "@components/Dropdown";
import CustomHeader from "@components/CustomHeader";
import {
  pageControlSelector,
  setSingleShipmentCreatePage,
} from "@slice/pageControlSlice";
import BackgroundView from "@components/BackgroundView";
import Space from "@components/Space";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetAllShipmentsStatusQuery } from "@api/shipmentStatusApi";
import { useGetAllOriginsQuery } from "@api/originApi";
import { useGetAllDestinationsQuery } from "@api/destinationApi";
import { useGetAllTrucksQuery } from "@api/truckApi";
import { useGetAllDriversQuery } from "@api/driverApi";
import { useGetAllClientsQuery } from "@api/clientApi";
import DropdownWrapper from "@components/DropdownWrapper";
import { ClientT, DestinationT, OriginT } from "@types/Shipment";
import CustomAlert from "@components/CustomAlert";
import { useGetAllContainersQuery } from "@api/containerApi";
import { useGetAllDocumentsQuery } from "@api/documentApi";
import { ContainerT } from "@types/Container";
import { PolicyT } from "@types/Policy";

const SinglePageShipmentForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // State
  const [containerNumber, setContainerNumber] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  // const [client, setClient] = useState<string>("");
  // const [driver, setDriver] = useState<string>("");
  const [vehicle, setVehicle] = useState<string>("");
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [shipmentStatusSelected, setShipmentStatusSelected] = useState(null);
  const [originSelected, setOriginSelected] = useState(null);
  const [destinationSelected, setDestinationSelected] = useState(null);
  const [clientSelected, setClientSelected] = useState(null);
  const [vehicleSelected, setVehicleSelected] = useState(null);
  const [driverSelected, setDriverSelected] = useState(null);
  const [isResetShipmentAlertVisible, setResetShipmentAlertVisible] =
    useState<boolean>(false);

  // Store
  const shipment = useAppSelector(shipmentSelector);
  const { isSingleShipmentCreatePage } = useAppSelector(pageControlSelector);

  // Queries
  const {
    currentData: clients,
    isError: isErrorClients,
    error: errorClients,
    isLoading: isLoadingClients,
    refetch: refetchClients,
    isFetching: isFetchingClients,
  } = useGetAllClientsQuery({});
  const {
    currentData: origins,
    isError: isErrorOrigins,
    error: errorOrigins,
    isLoading: isLoadingOrigins,
    refetch: refetchOrigins,
    isFetching: isFetchingOrigins,
  } = useGetAllOriginsQuery({});
  const {
    currentData: destinations,
    isError: isErrorDestinations,
    error: errorDestinations,
    isLoading: isLoadingDestinations,
    refetch: refetchDestinations,
    isFetching: isFetchingDestinations,
  } = useGetAllDestinationsQuery({});
  const {
    currentData: containers,
    isError: isErrorContainer,
    error: errorContainer,
    isLoading: isLoadingContainer,
    refetch: refetchContainers,
    isFetching: isFetchingContainers,
  } = useGetAllContainersQuery({});
  const {
    currentData: policies,
    isError: isErrorPolicies,
    error: errorPolicies,
    isLoading: isLoadingPolicies,
    refetch: refetchPolicies,
    isFetching: isFetchingPolicies,
  } = useGetAllDocumentsQuery({});
  const {
    data: shipmentStatusList,
    isLoading: isShipmentStatusLoading,
    isError: isShipmentStatusError,
  } = useGetAllShipmentsStatusQuery({});
  // const { data: clientList, isLoading: isClientLoading, isError: isClientError} = useGetAllClientsQuery({});
  const {
    data: vehicleList,
    isLoading: isVehicleLoading,
    isError: isVehicleError,
  } = useGetAllTrucksQuery({});
  const {
    data: driverList,
    isLoading: isdriverLoading,
    isError: isdriverError,
  } = useGetAllDriversQuery({});

  // Effects
  useEffect(() => {
    if (shipment) {
      setContainerNumber(shipment.container?.containerNumber || "");
      setWeight(shipment.weight?.toString() || "");
      setPrice(shipment.price?.toString() || "");
    }
  }, [shipment]);

  useEffect(() => {
    if (shipment && shipmentStatusList?.length > 0) {
      const shipmentStatus = shipmentStatusList?.find(
        (shipmentStatus: any) =>
          shipment.shipmentStatusId === shipmentStatus.shipmentStatusId
      );
      setShipmentStatusSelected(shipmentStatus);
    }
  }, [shipmentStatusList]);

  // useEffect(() => {
  //   if (shipment && originList?.length > 0) {
  //     const origin = originList?.find((origin: any) => shipment.originId === origin.originId)
  //     setOriginSelected(origin);
  //   }
  // }, [originList]);

  // useEffect(() => {
  //   if (shipment && destinationList?.length > 0) {
  //     const destination = destinationList?.find((destination: any) => shipment.destinationId === destination.destinationId)
  //     setDestinationSelected(destination);
  //   }
  // }, [destinationList]);

  // useEffect(() => {
  //   if (parsedShipment && clientList?.length > 0) {
  //     const client = clientList?.find((client: any) => parsedShipment.clientId === client.clientId)
  //     setClientSelected(client);
  //   }
  // }, [clientList]);

  useEffect(() => {
    if (shipment && vehicleList?.length > 0) {
      const vehicle = vehicleList?.find(
        (truck: any) => shipment.truckId === truck.truckId
      );
      setVehicleSelected(vehicle);
    }
  }, [vehicleList]);

  useEffect(() => {
    if (shipment && driverList?.length > 0) {
      const driver = driverList?.find(
        (driver: any) => shipment.user?.userId === driver.userId
      );
      setDriverSelected(driver);
    }
  }, [vehicleList]);

  useEffect(() => {
    setIsModified(
      containerNumber !== shipment.container?.containerNumber ||
        shipmentStatusSelected?.shipment !==
          shipment.shipmentStatus?.shipmentStatusId ||
        originSelected?.originId !== shipment.origin?.originId ||
        destinationSelected?.destinationId !==
          shipment.destination?.destinationId ||
        vehicleSelected?.truckId !== shipment.truck?.truckId ||
        driverSelected?.userId !== shipment.user?.userId ||
        price !== shipment.price ||
        weight !== shipment.weight
    );
  }, [
    containerNumber,
    shipment.container?.containerNumber,
    shipmentStatusSelected?.shipmentStatusId,
    shipment.shipmentStatus?.shipmentStatusId,
    originSelected?.originId,
    shipment.origin?.originId,
    destinationSelected?.destinationId,
    shipment.destination?.destinationId,
    vehicleSelected?.truckId,
    shipment.truck?.truckId,
    driverSelected?.userId,
    shipment.user?.userId,
    price,
    shipment.price,
    weight,
    shipment.weight,
  ]);

  const handleSave = () => {
    if (
      !containerNumber ||
      !weight ||
      !price ||
      !shipmentStatusSelected?.shipmentStatusId ||
      !originSelected?.originId ||
      !destinationSelected?.destinationId ||
      !vehicleSelected?.truckId
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    router.push("/shipments/summary");
  };

  const handleClientSelected = (value: any) => {
    dispatch(addClient(value));
  };

  const handleOriginSelected = (item: any) => {
    dispatch(addOrigin(item));
  };

  const handleDestinationSelected = (value: any) => {
    dispatch(addDestination(value));
  };

  const handleContainerSelected = (value: any) => {
    dispatch(addContainer(value));
  };

  const handlePolicySelected = (value: any) => {
    dispatch(addPolicy(value));
  };

  const handleWeightSelected = (value: any) => {
    dispatch(addWeight(value));
  };

  const handlePriceSelected = (value: any) => {
    dispatch(addPrice(value));
  };

  const handleCurrencySelected = (value: any) => {
    dispatch(addCurrency(value));
  };

  const handleDriverSelected = (value: any) => {
    dispatch(addDriver(value));
  };

  const handleVehicleSelected = (value: any) => {
    dispatch(addTruck(value));
  };

  const handleNotesSelected = (value: any) => {
    dispatch(addNotes(value));
  };

  const handleResetShipment = () => {
    dispatch(reset());
    router.back();
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <Space vertical size={15} />
        <CustomHeader
          title="Crear Viaje"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => setResetShipmentAlertVisible(true)}
          showChangeViewButton={true}
          isSinglePage={isSingleShipmentCreatePage}
          onChangeViewPress={() => {
            dispatch(setSingleShipmentCreatePage(false));
            router.replace("/shipments/create/add-shipment-client");
          }}
        />
        <CustomAlert
          isVisible={isResetShipmentAlertVisible}
          title="Alerta"
          titleColor="#ff0809bd"
          text="Si regresas el progreso de tu viaje sera eliminado y deberas de ingresarlo de nuevo, deseas continuar?"
          onClose={() => {
            setResetShipmentAlertVisible(false);
          }}
          buttons={[
            <Pressable
              onPress={() => {
                setResetShipmentAlertVisible(false);
              }}
            >
              <View style={styles.cancelButtonAlert}>
                <Text style={styles.cancelButtonTextAlert}>Cancelar</Text>
              </View>
            </Pressable>,
            <Pressable
              onPress={() => {
                handleResetShipment();
                setResetShipmentAlertVisible(false);
              }}
            >
              <View style={styles.continueButtonAlert}>
                <Text style={styles.continueButtonTextAlert}>Continuar</Text>
              </View>
            </Pressable>,
          ]}
        />
        <Space vertical size={50} />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <MaterialCommunityIcons name="truck-fast" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <DropdownWrapper
            label="Cliente"
            isLoading={isLoadingClients}
            isFetching={isFetchingClients}
            isError={isErrorClients}
            items={clients}
            placeholder="Selecciona un cliente"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item.name}`}
            onItemSelected={(item: ClientT) => handleClientSelected(item)}
            refetch={refetchClients}
            linkText="Agregar nuevo cliente"
            onLinkPress={() => console.log("Botón tipo link presionado")}
            {...(shipment.client && { initialSelectedItem: shipment.client })}
          />

          <DropdownWrapper
            label="Origen"
            isLoading={isLoadingOrigins}
            isFetching={isFetchingOrigins}
            isError={isErrorOrigins}
            items={origins}
            placeholder="Selecciona una origen"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item.name}`}
            onItemSelected={(item: OriginT) => handleOriginSelected(item)}
            refetch={refetchOrigins}
            linkText="Agregar nuevo origen"
            onLinkPress={() => console.log("Botón tipo link presionado")}
            {...(shipment.origin && { initialSelectedItem: shipment.origin })}
          />

          <DropdownWrapper
            label="Destino"
            isLoading={isLoadingDestinations}
            isFetching={isFetchingDestinations}
            isError={isErrorDestinations}
            items={destinations}
            placeholder="Selecciona un destino"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item.address}`}
            onItemSelected={(item: DestinationT) =>
              handleDestinationSelected(item)
            }
            refetch={refetchDestinations}
            linkText="Agregar nuevo destino"
            onLinkPress={() => console.log("Botón tipo link presionado")}
            {...(shipment.destination && {
              initialSelectedItem: shipment.destination,
            })}
          />

          <DropdownWrapper
            label="No. Contenedor"
            isLoading={isLoadingContainer}
            isFetching={isFetchingContainers}
            isError={isErrorContainer}
            items={containers}
            placeholder="Selecciona un contenedor"
            renderItemText={(item) => `${item.containerNumber}`}
            onItemSelected={(item: ContainerT) => handleContainerSelected(item)}
            refetch={refetchContainers}
            isEditable={true}
            {...(shipment.container && {
              initialSelectedItem: shipment.container,
            })}
          />

          <DropdownWrapper
            label="No. Póliza"
            isLoading={isLoadingPolicies}
            isFetching={isFetchingPolicies}
            isError={isErrorPolicies}
            items={policies}
            placeholder="Selecciona o Digita una póliza"
            renderItemText={(item) => `${item.documentNumber}`}
            onItemSelected={(item: PolicyT) => handlePolicySelected(item)}
            refetch={refetchPolicies}
            linkText="Agregar Póliza"
            onLinkPress={() => console.log("Botón tipo link presionado")}
            isEditable={true}
            {...(shipment.policy && { initialSelectedItem: shipment.policy })}
          />

          <Text style={styles.label}>Peso (Kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Ingrese el peso"
          />

          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="Ingrese el precio"
          />

          {/* <Text>Moneda</Text>
          <Dropdown items={[]} onItemSelected={handleSelectedCurrency} initialSelectedItem={currency} /> */}

          <Text style={styles.label}>Piloto</Text>
          <Dropdown
            items={driverList}
            placeholder="Selecciona un piloto"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item?.names}`}
            onItemSelected={(item) => handleDriverSelected(item)}
            initialSelectedItem={driverSelected ?? undefined}
          />

          <Text style={styles.label}>Vehiculo</Text>
          <Dropdown
            items={vehicleList}
            placeholder="Selecciona un vehiculo"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item?.plate}`}
            onItemSelected={(item) => handleVehicleSelected(item)}
            initialSelectedItem={vehicleSelected ?? undefined}
          />

          <Text>Notas</Text>
          {/* <TextInput value={notes} onChangeText={handleSelectedNotes} /> */}

          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: "#2073cdbd",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Guardar y Continuar
            </Text>
          </TouchableOpacity>
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
  disabledButton: {
    backgroundColor: "#9fa8da",
    opacity: 0.7,
  },
});

export default SinglePageShipmentForm;
