import React, { FC, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLazyGetAllDocumentsQuery } from '@api/documentApi';
import PolicyCard from '@components/PolicyCard';
import CalendarBox from '@components/CalendarBox';
import { format } from 'date-fns';

const PolicyList: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const router = useRouter();

  const [trigger, { data: policies, isLoading, isError, error, isUninitialized }] =
    useLazyGetAllDocumentsQuery();

  // Functions

  const handleSearch = () => {
    setRefreshing(true);
    const params: Record<string, string> = {};
    if (searchTerm) params.documentNumber = searchTerm;
    if (startDate) {
      const formattedStartDate = format(startDate as Date, 'yyyy-MM-dd');
      params.startDate = formattedStartDate;
    }
    if (endDate) {
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      params.endDate = formattedEndDate;
    }

    trigger(params)
      .unwrap()
      .finally(() => setRefreshing(false));
  };

  const onRefresh = useCallback(() => {
    handleSearch();
  }, [handleSearch]);

  const renderItem = ({ item }: { item: any }) => (
    <PolicyCard
      policy={item}
      onViewPress={() =>
        router.push({
          pathname: `/documents/[id]`,
          params: { id: item.documentId },
        })
      }
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader title="Pólizas" onBackPress={() => router.back()} showHelpButton={true} />
        <Space vertical size={15} />
        <Text style={{ color: '#71a780', fontWeight: '700' }}>Buscar Póliza</Text>
        <Space vertical size={5} />
        <SearchBox
          iconName="search"
          placeholder="Buscar póliza por número de documento"
          iconColor="#71a780"
          placeholderTextColor="#5db07587"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            <Space vertical size={15} />
            <Text style={{ color: '#71a780', fontWeight: '700' }}>Fecha Inicial</Text>
            <Space vertical size={5} />
            <CalendarBox
              onPress={() => {
                setShowEndDatePicker(false);
                setShowStartDatePicker((prevVal) => !prevVal);
              }}
              selectedDate={startDate}
              iconName="calendar"
              iconColor="#71a780"
            />
            {showStartDatePicker && (
              <DateTimePicker
                style={{
                  width: '200%',
                  zIndex: 300,
                }}
                value={startDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}
          </View>
          <View style={{ width: '50%' }}>
            <Space vertical size={15} />
            <Text style={{ color: '#71a780', fontWeight: '700' }}>Fecha Final</Text>
            <Space vertical size={5} />
            <CalendarBox
              onPress={() => {
                setShowStartDatePicker(false);
                setShowEndDatePicker((prevVal) => !prevVal);
              }}
              selectedDate={endDate}
              iconName="calendar"
              iconColor="#71a780"
            />
            {showEndDatePicker && (
              <DateTimePicker
                style={{
                  width: '200%',
                  marginLeft: '-100%',
                }}
                value={endDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}
          </View>
        </View>
        <Space vertical size={15} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/documents/create')}
            >
              <Text style={styles.buttonText}>Nueva Póliza</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: '50%' }}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Space vertical size={15} />
        {isError && (
          <View style={styles.center}>
            <Text>Algo ocurrió, favor intentar de nuevo</Text>
          </View>
        )}
        {isLoading || refreshing ? <ActivityIndicator /> : <></>}
        {!!policies?.length && !(isLoading || refreshing) && (
          <FlatList
            data={policies}
            keyExtractor={(item) => item.documentId.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
        {!policies?.length && !isUninitialized && !isLoading && !refreshing && (
          <View>
            <Space vertical size={200} />
            {searchTerm ? (
              <Text style={{ color: '#71a780', fontWeight: '700', textAlign: 'center' }}>
                No se encontraron pólizas con el filtro seleccionado
              </Text>
            ) : (
              <Text style={{ color: '#71a780', fontWeight: '700', textAlign: 'center' }}>
                No se encontraron pólizas
              </Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  listContainer: {
    flexGrow: 1,
    marginTop: 10,
  },
  policyCard: {
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
  policyInfo: {
    fontSize: 14,
    color: '#555',
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PolicyList;
