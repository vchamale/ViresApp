import React, { FC, useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import SearchBox from '@components/SearchBox';
import StartingPointCard from '@components/StartingPointCard';
import { useLazyGetAllOriginsQuery } from '@api/originApi';

const OriginList: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const router = useRouter();

  const [trigger, { data: origins, isLoading, isError, error }] = useLazyGetAllOriginsQuery();

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

  const renderItem = ({ item }: { item: any }) => {
    return (
      <StartingPointCard
        origin={item}
        onViewPress={() =>
          router.push({
            pathname: '/origin/[id]',
            params: { id: item.originId },
          })
        }
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader
          title="Punto de Partida"
          onBackPress={() => router.back()}
          showHelpButton={true}
        />
        <Space vertical size={15} />
        <Text style={{ color: '#71a780', fontWeight: '700' }}>Buscar Punto de Partida</Text>
        <Space vertical size={5} />
        <SearchBox
          iconName="search"
          placeholder="Buscar por nombre o dirección"
          iconColor="#71a780"
          placeholderTextColor="#5db07587"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Space vertical size={15} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/origin/create')}
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
          data={origins}
          keyExtractor={(item) => item.originId.toString()}
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
  originCard: {
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
  originName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  originInfo: {
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

export default OriginList;
