// app/shipment/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Space from '@components/Space';
import AnimatedText from '@components/AnimatedText';
import IconMapper from '@components/IconMapper';
import { statusMapper } from 'utils/common/statusMapper';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import { useGetShipmentByIdQuery } from '@api/shipmentApi';

const ShipmentView = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: shipment, isLoading, isError } = useGetShipmentByIdQuery(id);

  // hooks
  const router = useRouter();

  const {
    container,
    weight,
    price,
    origin,
    destination,
    client,
    shipmentStatus,
    user: driver,
    truck,
    notes,
  } = shipment ?? {};
  console.log('shipment ', shipment)

  const handleEdit = () => {
    router.push({
      pathname: `/shipments/edit/[id]`,
      params: { id, shipment: JSON.stringify(shipment) }
    })
  }

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
          <Space vertical size={15} />
          <CustomHeader
            title='Viaje'
            color='#fff'
            backgroundColor='#71a780'
            onBackPress={() => {
              router.back();
            }}
            showEditButton={true}
            onEditPress={handleEdit}
          />
        <Space vertical size={20} />
        <View style={{
          backgroundColor: '#88c69a',
          marginHorizontal: 20,
          padding: 20,
          borderRadius: 20,
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>
          <View>
            <Text style={{ color: '#fff' }}>No. Contenedor</Text>
            <Space vertical size={20} />
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20 }}>{container?.containerNumber}</Text>
          </View>
          <View style={{
            alignItems: 'center',
            
          }}>
            <Text style={{ color: '#fff' }}>Estado</Text>
            <Space vertical size={10} />
            <IconMapper {...statusMapper[shipmentStatus?.description?.toLowerCase() || '']} size={24} color='#fff' />
            <Space vertical size={10} />
            <Text
              style={{ 
                color: '#fff', //statusMapper[shipmentStatus?.description?.toLowerCase() || '']?.color || '#000', 
                fontWeight: '900' 
              }}
            >
              {shipmentStatus?.description?.toUpperCase()}
            </Text>
          </View>
        </View>
        <Space vertical size={20} />
        <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            {
              !['CANCELADO', 'ELIMINADO', 'FINALIZADO', 'COBRADO', 'ENTREGADO'].includes(shipmentStatus?.description?.toUpperCase()) && 
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => {}}
                >
                  <Text style={styles.buttonText}>Cancelar Viaje</Text>
                </TouchableOpacity>
            }
            {
              ['CANCELADO'].includes(shipmentStatus?.description?.toUpperCase()) && 
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: '#ff8e00cf'}]}
                onPress={() => {}}
              >
                <Text style={styles.buttonText}>Reanudar Viaje</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={{ width: '50%' }}>
            <TouchableOpacity style={styles.createButton} onPress={handleEdit}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Space vertical size={70} />
        <ScrollView style={styles.container}>
          <View style={styles.card}>
            <View style={[styles.row, { justifyContent: 'space-around' }]}>
              <View>
                <Text style={styles.label}>No. Contenedor</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{container?.containerNumber || 'N/A'}</Text>
              </View>
              <View></View>
              <View>
                <Text style={styles.label}>Peso</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{weight} kg</Text>
              </View>
            </View>
            <Space vertical size={10} />
            <View style={{
              marginLeft: 22
            }}>
              <Text style={styles.label}>Precio</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>
                {`${price ?? ''}`}
              </Text>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Origen</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{origin?.name || 'N/A'}</Text>
                <Text style={styles.text}>{origin?.address || 'N/A'}</Text>
              </View>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Destino</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{destination?.name || 'N/A'}</Text>
                <Text style={styles.text}>{destination?.address || 'N/A'}</Text>
              </View>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Piloto</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{`${driver?.names} ${driver?.lastNames}` || 'N/A'}</Text>
              </View>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Camión</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{truck?.plate || 'N/A'}</Text>
              </View>
              <Space vertical size={10} />
              <Text style={styles.label}>Notas</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>{notes || 'Sin notas adicionales'}</Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
    // </View>
  );
};

export default ShipmentView;

const styles = StyleSheet.create({
  upperBackground: {
    flex: 1,
    // backgroundColor: '#6200EE',
    borderBottomLeftRadius: 200, // Bordes redondeados
    borderBottomRightRadius: 50,
    zIndex: 1, // Asegura que esté detrás del contenido
  },
  lowerBackground: {
    flex: 1,
    // backgroundColor: '#BB86FC',
    borderTopLeftRadius: -10, // Bordes redondeados
    borderTopRightRadius: 60,
    marginTop: 100, // Superpone la parte inferior con el color superior
  },
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
    padding: 10,
    zIndex: 2,
  },
  card: {
    // backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    color: '#5db075',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: "#2073cdbd",
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: 'center',
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "#ff0809bd",
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});
