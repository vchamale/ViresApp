import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Space from '@components/Space';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import { useGetDocumentByIdQuery } from '@api/documentApi';

const PolicyView = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const router = useRouter();

  const { data: policy, isLoading, isError } = useGetDocumentByIdQuery(id);

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading policy</Text>;

  const { documentNumber } = policy ?? {};

  const handleEdit = () => {
    router.push({
      pathname: `/documents/edit/[id]`,
      params: { id, policy: JSON.stringify(policy) },
    });
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <Space vertical size={15} />
        <CustomHeader
          title="Póliza"
          color="#fff"
          backgroundColor="#71a780"
          onBackPress={() => {
            router.back();
          }}
          onEditPress={handleEdit}
          showEditButton={true}
        />
        <Space vertical size={20} />
        <ScrollView style={styles.container}>
          <View style={styles.card}>
            <View style={[styles.row]}>
              <Text style={styles.label}>No. Documento</Text>
              <Text style={styles.text}>{documentNumber || 'N/A'}</Text>
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
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

export default PolicyView;

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
  label: {
    fontWeight: '700',
    color: '#5db075',
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#ff0809bd',
    paddingVertical: 10,
    borderRadius: 5,
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
  text: {
    fontSize: 14,
    color: '#333',
  },
});
