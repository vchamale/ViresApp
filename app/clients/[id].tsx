// app/client/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Space from '@components/Space';
import AnimatedText from '@components/AnimatedText';
import IconMapper from '@components/IconMapper';
import { statusMapper } from 'utils/common/statusMapper';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import { useGetClientByIdQuery } from '@api/clientApi';

const ClientView = () => {
  const { id } = useLocalSearchParams<{ client: any, id: string }>();


  // hooks
  const router = useRouter();

  const { data: client, isLoading, isError } = useGetClientByIdQuery(id);

  const {
    name,
    nit,
    email,
    address,
    contactName,
    telephone
  } = client ?? {};

  const handleEdit = () => {
    router.push({
      pathname: `/clients/edit/[id]`,
      params: { id, client: JSON.stringify(client) }
    })
  }

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
          <Space vertical size={15} />
          <CustomHeader
            title='Cliente'
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
            <Text style={{ color: '#fff' }}>Nombre</Text>
            <Space vertical size={20} />
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20 }}>{name}</Text>
          </View>
          <View style={{
            alignItems: 'center',
            
          }}>
          </View>
        </View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 0 }}>
            <View style={{ width: '50%' }} />
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
                <Text style={styles.label}>NIT</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{nit || 'N/A'}</Text>
              </View>
              <View></View>
              <View>
                <Text style={styles.label}>Email</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{email}</Text>
              </View>
            </View>
            <Space vertical size={10} />
            <View style={{
              marginLeft: 22
            }}>
              <Text style={styles.label}>Contacto</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>
                {contactName}
              </Text>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>No. Telefono</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{telephone}</Text>
              </View>
              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Dirección</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{address}</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
    // </View>
  );
};

export default ClientView;

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
