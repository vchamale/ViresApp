import React, { FC, useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import SearchBox from '@components/SearchBox';
import { useLazyGetAllDestinationsQuery } from '@api/destinationApi';
import DestinationPointCard from '@components/DestinationCard';

const DestinationList: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const router = useRouter();

  const [trigger, { data: destinations, isLoading, isError, error }] =
    useLazyGetAllDestinationsQuery();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    trigger({})
      .unwrap()
      .finally(() => setRefreshing(false));
  }, [trigger]);

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;

    trigger(params);
  };

  const renderItem = ({ item }: { item: any }) => (
    <DestinationPointCard
      origin={item}
      onViewPress={() =>
        router.push({
          pathname: '/destination/[id]',
          params: { id: item.destinationId },
        })
      }
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader title="Destinos" onBackPress={() => router.back()} showHelpButton={true} />
        <Space vertical size={15} />
        <Text style={{ color: '#5db075', fontWeight: '700' }}>Buscar Destino</Text>
        <Space vertical size={5} />
        <SearchBox
          iconName="search"
          placeholder="Buscar destino por cliente, nombre o dirección"
          iconColor="#5db075"
          placeholderTextColor="#5db07587"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Space vertical size={15} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/destination/create')}
            >
              <Text style={styles.buttonText}>Nuevo Destino</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: '50%' }}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Space vertical size={15} />
        <FlatList
          data={destinations}
          keyExtractor={(item) => item.destinationId.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    marginTop: 10,
  },
  destinationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  destinationInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  searchButton: {
    backgroundColor: '#71a780',
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
});

export default DestinationList;
