// R/RN
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, FlatList } from 'react-native';
// Expo stuff
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
// API
import { useGetAllContainersQuery } from '@api/containerApi';
import { useGetAllCurrencysQuery } from '@api/currencyApi';
// Slices
import { addContainerDetails as saveContainerDetails } from '@slice/shipmentSlice';
// Hooks
import { useAppDispatch } from '@hooks/useRedux';
import { useSnackbar } from '@components/context/SnackbarContext';
// Components
import Space from '@components/Space';
import Dropdown from '@components/Dropdown';
import CustomHeader from '@components/CustomHeader';
// Types
import { CurrencyT } from '@types/Currency';
import { ContainerT } from '@types/Container';

const AddContainerDetails = () => {
  // State
  const [container, setContainer] = useState<ContainerT | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [currency, setCurrency] = useState<CurrencyT | null>(null);

  // Vars

  // hooks
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  // API Calls
    // Querys
    const { currentData: containers } = useGetAllContainersQuery({});
    const { currentData: currencies } = useGetAllCurrencysQuery({});
    // Mutations

  // Functions
  const handlePriceInput = (text: string) => {
    setPrice(parseFloat(text));
  };

  const handleWeightInput = (text: string) => {
    setWeight(parseFloat(text));
  };

  const handleSelectContainer = (container: ContainerT) => {
    setContainer(container);
  };

  const handleContinueButton = () => {
    if (!container) {
      return showSnackbar({
        message: "Debes seleccionar un contenedor para continuar.",
        color: "red",
        duration: 3000
      });
    }

    if (!price) {
      return showSnackbar({
        message: "Debes ingresar un precio para continuar.",
        color: "red",
        duration: 3000
      });
    }

    if (!weight) {
      return showSnackbar({
        message: "Debes ingresar un peso para continuar.",
        color: "red",
        duration: 3000
      });
    }

    dispatch(saveContainerDetails({
      container,
      weight,
      price: {
        amount: price,
        currency
      }
    }));

    router.push('/shipments/create/add-transport-details');
  }
  
  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={styles.container}>
        <CustomHeader 
          title={'Detalle del Contenedor'} 
          onBackPress={() => {
            router.back();
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <FontAwesome6 name='truck-ramp-box' size={100} color='#5db075' />
        </View>
        <Space vertical size={100} />
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={[{ key: 'form' }]}
          keyExtractor={(item) => item.key}
          renderItem={() => (
            <>
              <Text style={styles.label}>No. Contenedor</Text>
              <Dropdown 
                items={containers}
                placeholder="Selecciona un contenedor"
                renderItemText={(item) => `${item.containerNumber}`}
                onItemSelected={(item: ContainerT) => handleSelectContainer(item)}
                linkText="Agregar nuevo contenedor"
                onLinkPress={() => console.log('Botón tipo link presionado')}
              />
              {/* <Text style={styles.label}>Póliza</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="Enter Price"
              /> */}
              <Text style={styles.label}>Peso</Text>
              <View style={{
                flexDirection: 'row',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                height: 40,
                width: 100,
                borderColor: '#ccc',
                borderWidth: 1,
                marginBottom: 16,
                paddingHorizontal: 8,
                borderRadius: 4,
              }}>
                <TextInput
                  style={{
                    height: 40,
                    width: '70%',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                  value={weight}
                  onChangeText={handleWeightInput}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={{
                  height: 40,
                  width: '30%',
                  justifyContent: 'flex-end',
                  textAlign: 'right',
                  alignContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end'
                }}>Kg</Text>
              </View>
              <Text style={styles.label}>Precio</Text>
              <View style={{
                flexDirection: 'row'
              }}>
                <View style={{
                  width: 50
                }}>
                  <Dropdown
                    items={currencies}
                    placeholder="Q"
                    renderItemText={(item) => `${item.simbol}`}
                    onItemSelected={(item: CurrencyT) => setCurrency(item)}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={handlePriceInput}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </>
          )}
          />
        <Button title="Continuar" onPress={handleContinueButton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  flatListContainer: {
    flexGrow: 1
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
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
  containerSteps: {
    height: 100,
    width: 1000,
  },
  currentStepText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  }
});

export default AddContainerDetails;
