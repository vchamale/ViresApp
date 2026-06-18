import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Space from '@components/Space';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import { useGetTruckByIdQuery } from '@api/truckApi';

const VehicleView = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const { data: vehicle, isLoading, isError } = useGetTruckByIdQuery(id);

  const handleEdit = () => {
    router.push({
      pathname: `/vehicles/edit/[id]`,
      params: { id, vehicle: JSON.stringify(vehicle) },
    });
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <Space vertical size={15} />
        <CustomHeader
          title="Vehículo"
          color="#fff"
          backgroundColor="#71a780"
          onBackPress={() => {
            router.back();
          }}
          showEditButton={true}
          onEditPress={handleEdit}
        />
        <Space vertical size={20} />
        <View style={styles.card}>
          <View style={[styles.row]}>
            <Text style={styles.label}>Placa</Text>
            <Text style={styles.text}>{vehicle?.plate || 'N/A'}</Text>
          </View>
          <Space vertical size={10} />
        </View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 0, marginHorizontal: 10 }}>
          <View style={{ width: '50%' }} />
          <View style={{ width: '50%' }}>
            <TouchableOpacity style={styles.createButton} onPress={handleEdit}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Space vertical size={150} />
        <ScrollView style={styles.container}>
          <View>
            <View>
              <Text style={styles.label}>VIN</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>{vehicle?.vin || 'N/A'}</Text>
            </View>
            <Space vertical size={15} />
            <View>
              <Text style={styles.label}>Año</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>{vehicle?.year}</Text>
            </View>
            <Space vertical size={15} />
            <View>
              <Text style={styles.label}>Modelo</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>{vehicle?.model?.name}</Text>
            </View>
          </View>
          {/* </View> */}
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

export default VehicleView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  createButton: {
    backgroundColor: '#2073cdbd',
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#ff0809bd',
    paddingVertical: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: '700',
    color: '#5db075',
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});
