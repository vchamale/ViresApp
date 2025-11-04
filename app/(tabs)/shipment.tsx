import { FC, useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGetAllShipmentsQuery, useLazyGetAllShipmentsQuery } from '@api/shipmentApi';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import SearchBox from '@components/SearchBox';
import IconMapper from '@components/IconMapper';
import CalendarBox from '@components/CalendarBox';
import { ActivityIndicator } from '@react-native-material/core';
import ShipmentCard from '@components/ShipmentCard';
import { ShipmentT } from '@models/Shipment';
import { format } from 'date-fns';

const Shipment: FC = () => {
  const { searchTermParam } = useLocalSearchParams<{ searchTermParam: any }>();
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [containerSearch, setContainerSearch] = useState<string>('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [refetch, setRefetch] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (searchTermParam) {
      // Ejecutar la consulta solo una vez si viene el parámetro
      trigger({ search: searchTermParam })
        .unwrap()
        .finally(() => {
          // Elimina el parámetro de la URL después de procesarlo
          router.replace('/(tabs)/shipment');
        });
    }
  }, [searchTermParam]);

  // hooks
  const router = useRouter();

  // Api calls
  const [trigger, { data: shipments, isLoading, isError, error, isUninitialized }] =
    useLazyGetAllShipmentsQuery();

  const handleSearch = () => {
    setRefreshing(true);
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
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

  const handleCreateNewShipment = () => {
    router.push('/shipments/create/single/create');
  };

  const renderItem = ({ item }: { item: ShipmentT }) => {
    return (
      <ShipmentCard
        status={item.shipmentStatus?.description?.toLowerCase() as string}
        containerNumber={item.container?.containerNumber as string}
        destination={item.destination?.name as string}
        date={new Date(item?.dateCreated).toDateString()}
        onViewPress={() =>{
          console.log('asdas ', item.shipmentId)
          router.push({
            pathname: `/shipments/[id]`,
            params: { id: item.shipmentId },
          })
        }}
      />
    );
  };

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader
          title="Viajes"
          onBackPress={() => {
            router.back();
          }}
          showHelpButton={true}
        />
        <Space vertical size={15} />
        <Text style={{ color: '#71a780', fontWeight: '700' }}>No. Contenedor</Text>
        <Space vertical size={5} />
        <SearchBox
          iconName="container"
          placeholder="Buscar contenedor"
          iconColor="#71a780"
          placeholderTextColor="#5db07587"
          value={searchTerm}
          onChangeText={(value: string) => {
            // setRefreshing(true);
            setSearchTerm(value);
          }}
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
        <Space vertical size={20} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateNewShipment}>
              <Text style={styles.buttonText}>Nuevo Viaje</Text>
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
        {!!shipments?.length && !(isLoading || refreshing) && (
          <FlatList
            data={shipments}
            keyExtractor={(item) =>
              `${item?.container?.containerNumber as string}-${item?.shipmentId}`
            }
            contentContainerStyle={styles.table}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
        {!shipments?.length && !isUninitialized && !isLoading && !refreshing && (
          <View>
            <Space vertical size={200} />
            {searchTerm ? (
              <Text style={{ color: '#71a780', fontWeight: '700', textAlign: 'center' }}>
                No se encontraron viajes con el filtro seleccionado
              </Text>
            ) : (
              <Text style={{ color: '#71a780', fontWeight: '700', textAlign: 'center' }}>
                No se encontraron viajes
              </Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  input: {
    height: 40,
    borderColor: '#71a780',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  containerSearchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
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
  table: {
    flexGrow: 1,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#fff',
    backgroundColor: '#5db075',
    paddingVertical: 10,
  },
});

export default Shipment;
