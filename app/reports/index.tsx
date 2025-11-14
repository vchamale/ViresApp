import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Button,
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
import { useGetAllClientsQuery, useLazyGetAllClientsQuery } from '@api/clientApi';
import ClientCard from '@components/ClientCard';
import CalendarBox from '@components/CalendarBox';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropdownWrapper from '@components/DropdownWrapper';
import { useGetAllDriversQuery } from '@api/driverApi';
import { DriverT } from '@models/Driver';
import { ClientT, ShipmentStatusT } from '@models/Shipment';
import { useLazyGetOriginsByClientIdQuery } from '@api/originApi';
import { useLazyGetDestinationsByClientIdQuery } from '@api/destinationApi';
import Dropdown from '@components/Dropdown';
import { useGetAllShipmentsStatusQuery } from '@api/shipmentStatusApi';
import { useLazyGetAllShipmentsQuery } from '@api/shipmentApi';
import ShipmentsPdfGenerator from './ShipmentsPDFGenerator';

const Reports: FC = () => {

   const {
      data: shipmentStatusList,
      isLoading: isShipmentStatusLoading,
      isFetching: isShipmentStatusFetching,
      isError: isShipmentStatusError,
      refetch: refetchShipmentStatus
    } = useGetAllShipmentsStatusQuery({});

    const {
      data: drivers,
      isLoading: isDriverLoading,
      isFetching: isDriverFetching,
      isError: isDriverError,
      refetch: refetchDrivers
    } = useGetAllDriversQuery({});

    const {
        currentData: clients,
        isError: isErrorClients,
        error: errorClients,
        isLoading: isLoadingClients,
        refetch: refetchClients,
        isFetching: isFetchingClients,
      } = useGetAllClientsQuery({});

        const [triggerOrigins, originsQuery] = useLazyGetOriginsByClientIdQuery();
          const [triggerDestinations, destinationsQuery] = useLazyGetDestinationsByClientIdQuery();
        
      

  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [driverSelected, setDriverSelected] = useState<DriverT | null>(null);
  const [clientSelected, setClientSelected] = useState<ClientT | null>(null);
  const [shipmentStatusSelected, setShipmentStatusSelected] = useState(null);
      
    
    const handleShipmentStatusSelected = (item: any) => {
    setShipmentStatusSelected(item);
  };
  

  const router = useRouter();

  const [trigger, { data: shipments, isLoading, isError, error, isUninitialized }] =
    useLazyGetAllShipmentsQuery();

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

  // const renderItem = ({ item }: { item: any }) => (
  //   <ClientCard
  //     client={item}
  //     onViewPress={() =>
  //       router.push({
  //         pathname: '/clients/[id]',
  //         params: { id: item.clientId },
  //       })
  //     }
  //   />
  // );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader title="Reportes" onBackPress={() => router.back()} showHelpButton={false} />
        <Space vertical size={15} />
        <Text style={{ color: '#5db075', fontWeight: '700' }}>Crear Reporte</Text>
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
        <Space vertical size={5} />
        <Space vertical size={15} />

        <View>
          <DropdownWrapper
            label="Piloto"
            isLoading={isDriverLoading}
            isFetching={isDriverFetching}
            isError={isDriverError}
            items={drivers ?? []}
            placeholder="Selecciona un piloto"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item.names}`}
            onItemSelected={(item: DriverT) => setDriverSelected(item)}
            refetch={refetchDrivers}
          />
        </View>

        <Space vertical size={15} />
        <View>
          <DropdownWrapper
            label="Cliente"
            isLoading={isLoadingClients}
            isFetching={isFetchingClients}
            isError={isErrorClients}
            items={clients ?? []}
            placeholder="Selecciona un cliente"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item.name}`}
            onItemSelected={(item: ClientT) => {
              setClientSelected(item)
              triggerOrigins({ clientId: item.clientId })
              triggerDestinations({ clientId: item.clientId })
            }}
            refetch={refetchClients}
            linkText="Agregar nuevo cliente"
            onLinkPress={() => console.log('Botón tipo link presionado')}
          />
        </View>
        <Space vertical size={15} />
        <View>
          {/* <Dropdown
            items={shipmentStatusList}
            renderItemText={(item) => `${item?.description}`}
            onItemSelected={(item) => handleShipmentStatusSelected(item)}
            placeholder="Selecciona un estado"
            initialSelectedItem={shipmentStatusSelected ?? undefined}
          /> */}
          <DropdownWrapper
            label="Estado"
            isLoading={isShipmentStatusLoading}
            isFetching={isShipmentStatusFetching}
            isError={isShipmentStatusError}
            items={shipmentStatusList ?? []}
            placeholder="Selecciona un cliente"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item.description}`}
            onItemSelected={(item: ShipmentStatusT) => {
              handleShipmentStatusSelected(item)
            }}
            refetch={refetchShipmentStatus}
            linkText="Agregar nuevo estado"
            onLinkPress={() => console.log('Botón tipo link presionado')}
          />
        </View>
        <View>
          <Button title="Cargar viajes" onPress={handleSearch} />

    {shipments && shipments.length > 0 && (
      <ShipmentsPdfGenerator shipments={shipments} />
    )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    marginTop: 10,
  },
  clientCard: {
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
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clientInfo: {
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

export default Reports;
