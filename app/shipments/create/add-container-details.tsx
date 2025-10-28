// R/RN
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
// Expo stuff
import { useRouter } from 'expo-router';
import { Octicons } from '@expo/vector-icons';
// API
import { useGetAllContainersQuery } from '@api/containerApi';
import { useGetAllCurrencysQuery } from '@api/currencyApi';
// Slices
import {
  addContainer,
  addCurrency,
  addPolicy,
  addPrice,
  addWeight,
  shipmentSelector,
} from '@slice/shipmentSlice';
// Hooks
import { useAppDispatch, useAppSelector } from '@hooks/useRedux';
import { useSnackbar } from '@components/context/SnackbarContext';
// Components
import Space from '@components/Space';
import Dropdown from '@components/Dropdown';
import CustomHeader from '@components/CustomHeader';
// Types
import { CurrencyT } from '@types/Currency';
import { ContainerT } from '@types/Container';
import BackgroundView from '@components/BackgroundView';
import { useGetAllDocumentsQuery } from '@api/documentApi';
import { PolicyT } from '@types/Policy';
import DropdownWrapper from '@components/DropdownWrapper';
import { pageControlSelector, setSingleShipmentCreatePage } from '@slice/pageControlSlice';

const AddContainerDetails = () => {
  // State
  // const [container, setContainer] = useState<ContainerT | null>(null);
  // const [policy, setPolicy] = useState<PolicyT | null>(null);
  // const [price, setPrice] = useState<number>(0);
  // const [weight, setWeight] = useState<number>(0);
  // const [currency, setCurrency] = useState<CurrencyT | null>(null);

  // Store
  const { container, policy, price, weight } = useAppSelector(shipmentSelector);
  const { isSingleShipmentCreatePage } = useAppSelector(pageControlSelector);

  // Vars

  // hooks
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  // API Calls
  // Querys
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
    currentData: currencies,
    isError: isErrorCurrencies,
    error: errorCurrencies,
    isLoading: isLoadingCurrencies,
    refetch: refetchCurrencies,
    isFetching: isFetchingCurrencies,
  } = useGetAllCurrencysQuery({});

  // Mutations

  // effects
  useEffect(() => {
    if (currencies?.length) {
      dispatch(addCurrency(currencies?.[0]));
    }
  }, [currencies]);

  // Functions
  const handlePriceInput = (text: string) => {
    dispatch(addPrice(parseFloat(text)));
    // setPrice(parseFloat(text));
  };

  const handleWeightInput = (text: string) => {
    dispatch(addWeight(parseFloat(text)));
    // setWeight(parseFloat(text));
  };

  const handleSelectContainer = (container: ContainerT) => {
    console.log('container ', container);
    if (!container.containerId) {
    }
    dispatch(addContainer(container));
    // setContainer(container);
  };

  const handleSelectPolicy = (policy: PolicyT) => {
    dispatch(addPolicy(policy));
    // setPolicy(policy);
  };

  const handleSelectCurrency = (currency: CurrencyT) => {
    dispatch(addCurrency(currency));
    // setPolicy(policy);
  };

  const handleContinueButton = () => {
    if (!container) {
      return showSnackbar({
        message: 'Debes seleccionar un contenedor para continuar.',
        color: 'red',
        duration: 3000,
      });
    }

    if (!policy) {
      return showSnackbar({
        message: 'Debes seleccionar una póliza para continuar.',
        color: 'red',
        duration: 3000,
      });
    }

    if (!price) {
      return showSnackbar({
        message: 'Debes ingresar un precio para continuar.',
        color: 'red',
        duration: 3000,
      });
    }

    if (!weight) {
      return showSnackbar({
        message: 'Debes ingresar un peso para continuar.',
        color: 'red',
        duration: 3000,
      });
    }

    if (!price.currency) {
      return showSnackbar({
        message: 'Debes ingresar un tipo de moneda para continuar.',
        color: 'red',
        duration: 3000,
      });
    }

    // dispatch(saveContainerDetails({
    //   container,
    //   policy,
    //   weight,
    //   price: {
    //     amount: price,
    //     currency
    //   }
    // }));

    // if ()

    router.push('/shipments/create/add-transport-details');
  };

  return (
    <BackgroundView>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <CustomHeader
            title={'Detalle del Contenedor'}
            backgroundColor="#71a780"
            color="#fff"
            onBackPress={() => {
              router.back();
            }}
            isSinglePage={isSingleShipmentCreatePage}
            showChangeViewButton={true}
            onChangeViewPress={() => {
              dispatch(setSingleShipmentCreatePage(true));
              router.replace('/shipments/create/single/create');
            }}
          />
          <Space vertical size={50} />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Octicons name="container" size={100} color="#fff" />
          </View>
          <Space vertical size={120} />
          <FlatList
            contentContainerStyle={styles.flatListContainer}
            data={[{ key: 'form' }]}
            keyExtractor={(item) => item.key}
            renderItem={() => (
              <>
                <DropdownWrapper
                  isLoading={isLoadingContainer}
                  isFetching={isFetchingContainers}
                  isError={isErrorContainer}
                  items={containers}
                  placeholder="Selecciona un contenedor"
                  renderItemText={(item) => `${item.containerNumber}`}
                  onItemSelected={(item: ContainerT) => handleSelectContainer(item)}
                  refetch={refetchContainers}
                  label="No. Contenedor"
                  isEditable={true}
                />
                <DropdownWrapper
                  isLoading={isLoadingPolicies}
                  isFetching={isFetchingPolicies}
                  isError={isErrorPolicies}
                  items={policies}
                  placeholder="Selecciona o Digita una póliza"
                  renderItemText={(item) => `${item.documentNumber}`}
                  onItemSelected={(item: PolicyT) => handleSelectPolicy(item)}
                  refetch={refetchPolicies}
                  label="No. Póliza"
                  linkText="Agregar Póliza"
                  onLinkPress={() => console.log('Botón tipo link presionado')}
                  isEditable={true}
                />
                <Text style={styles.label}>Peso</Text>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 40,
                      width: 100,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      marginBottom: 16,
                      paddingHorizontal: 8,
                      borderRadius: 4,
                    }}
                  >
                    <TextInput
                      style={{
                        height: 40,
                        width: '70%',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                      value={weight}
                      onChangeText={handleWeightInput}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                    />
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          height: 40,
                          paddingTop: 10,
                        }}
                      >
                        Kg
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.label}>Precio</Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                    }}
                  >
                    <DropdownWrapper
                      isLoading={isLoadingCurrencies}
                      isFetching={isFetchingCurrencies}
                      isError={isErrorCurrencies}
                      items={currencies}
                      placeholder=""
                      renderItemText={(item) => `${item.simbol}`}
                      onItemSelected={(item: CurrencyT) => handleSelectCurrency(item)}
                      refetch={refetchCurrencies}
                      initialSelectedItem={currencies?.[0] ?? null}
                    />
                    <TextInput
                      style={styles.inputPrice}
                      value={price}
                      onChangeText={handlePriceInput}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                    />
                  </View>
                </View>
              </>
            )}
          />
          <TouchableOpacity style={styles.createButton} onPress={handleContinueButton}>
            <Text style={styles.buttonText}>Continuar</Text>
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
  flatListContainer: {
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#71a780',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  inputPrice: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  containerSteps: {
    height: 100,
    width: 1000,
  },
  currentStepText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  createButton: {
    marginHorizontal: 50,
    backgroundColor: '#2073cdbd',
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddContainerDetails;
