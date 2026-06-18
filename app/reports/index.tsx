// import React, { FC, useCallback, useState } from 'react';
// import {
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import CustomHeader from '@components/CustomHeader';
// import Space from '@components/Space';
// import { useGetAllClientsQuery } from '@api/clientApi';
// import { useGetAllDriversQuery } from '@api/driverApi';
// import { DriverT } from '@models/Driver';
// import { ClientT, ShipmentStatusT } from '@models/Shipment';
// import { useLazyGetOriginsByClientIdQuery } from '@api/originApi';
// import { useLazyGetDestinationsByClientIdQuery } from '@api/destinationApi';
// import DropdownWrapper from '@components/DropdownWrapper';
// import CalendarBox from '@components/CalendarBox';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useGetAllShipmentsStatusQuery } from '@api/shipmentStatusApi';
// import { useLazyGetAllShipmentsQuery } from '@api/shipmentApi';
// import ShipmentsPdfGenerator from './ShipmentsPDFGenerator';
// import { ActivityIndicator } from '@react-native-material/core';
// import { format } from 'date-fns';
// import { FileText } from 'lucide-react-native'; // 👈 Lucide icon

// const Reports: FC = () => {
//   const router = useRouter();

//   const {
//     data: shipmentStatusList,
//     isLoading: isShipmentStatusLoading,
//     isFetching: isShipmentStatusFetching,
//     isError: isShipmentStatusError,
//     refetch: refetchShipmentStatus,
//   } = useGetAllShipmentsStatusQuery({});

//   const {
//     data: drivers,
//     isLoading: isDriverLoading,
//     isFetching: isDriverFetching,
//     isError: isDriverError,
//     refetch: refetchDrivers,
//   } = useGetAllDriversQuery({});

//   const {
//     currentData: clients,
//     isError: isErrorClients,
//     isLoading: isLoadingClients,
//     refetch: refetchClients,
//     isFetching: isFetchingClients,
//   } = useGetAllClientsQuery({});

//   const [triggerOrigins] = useLazyGetOriginsByClientIdQuery();
//   const [triggerDestinations] = useLazyGetDestinationsByClientIdQuery();

//   const [trigger, { data: shipments, isLoading, isError, isUninitialized }] =
//     useLazyGetAllShipmentsQuery();

//   const [refreshing, setRefreshing] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [driverSelected, setDriverSelected] = useState<DriverT | null>(null);
//   const [clientSelected, setClientSelected] = useState<ClientT | null>(null);
//   const [shipmentStatusSelected, setShipmentStatusSelected] =
//     useState<ShipmentStatusT | null>(null);

//   const handleShipmentStatusSelected = (item: ShipmentStatusT) => {
//     setShipmentStatusSelected(item);
//   };

//   const handleSearch = useCallback(() => {
//     setRefreshing(true);

//     const params: Record<string, string> = {};

//     if (driverSelected) params.driverId = `${driverSelected.userId}`;
//     if (clientSelected) params.clientId = `${clientSelected.clientId}`;
//     if (shipmentStatusSelected) {
//       // Ajusta el campo según tu API
//       // @ts-ignore
//       params.shipmentStatusId = `${shipmentStatusSelected.shipmentStatusId}`;
//     }

//     if (startDate) {
//       params.startDate = format(startDate as Date, 'yyyy-MM-dd');
//     }
//     if (endDate) {
//       params.endDate = format(endDate as Date, 'yyyy-MM-dd');
//     }

//     trigger(params)
//       .unwrap()
//       .finally(() => setRefreshing(false));
//   }, [driverSelected, clientSelected, shipmentStatusSelected, startDate, endDate, trigger]);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//       <View style={{ padding: 15, flex: 1 }}>
//         <CustomHeader title="Reportes" onBackPress={() => router.back()} showHelpButton={false} />
//         <Space vertical size={15} />

//         {/* Fechas igual que en Shipment */}
//         <View style={{ flexDirection: 'row' }}>
//           <View style={{ width: '50%', paddingRight: 10 }}>
//             <Space vertical size={15} />
//             <Text style={{ color: '#71a780', fontWeight: '700' }}>Fecha Inicial</Text>
//             <Space vertical size={5} />
//             <CalendarBox
//               onPress={() => {
//                 setShowEndDatePicker(false);
//                 setShowStartDatePicker((prevVal) => !prevVal);
//               }}
//               selectedDate={startDate}
//               iconName="calendar"
//               iconColor="#71a780"
//             />
//             {showStartDatePicker && (
//               <DateTimePicker
//                 style={{ width: '200%' }}
//                 value={startDate || new Date()}
//                 mode="date"
//                 display={Platform.OS === 'ios' ? 'inline' : 'default'}
//                 onChange={(event, selectedDate) => {
//                   setShowStartDatePicker(false);
//                   if (selectedDate) setStartDate(selectedDate);
//                 }}
//               />
//             )}
//           </View>

//           <View style={{ width: '50%' }}>
//             <Space vertical size={15} />
//             <Text style={{ color: '#71a780', fontWeight: '700' }}>Fecha Final</Text>
//             <Space vertical size={5} />
//             <CalendarBox
//               onPress={() => {
//                 setShowStartDatePicker(false);
//                 setShowEndDatePicker((prevVal) => !prevVal);
//               }}
//               selectedDate={endDate}
//               iconName="calendar"
//               iconColor="#71a780"
//             />
//             {showEndDatePicker && (
//               <DateTimePicker
//                 style={{ width: '200%', marginLeft: '-100%' }}
//                 value={endDate || new Date()}
//                 mode="date"
//                 display={Platform.OS === 'ios' ? 'inline' : 'default'}
//                 onChange={(event, selectedDate) => {
//                   setShowEndDatePicker(false);
//                   if (selectedDate) setEndDate(selectedDate);
//                 }}
//               />
//             )}
//           </View>
//         </View>

//         <Space vertical size={15} />

//         {/* Dropdowns */}
//         <View>
//           <DropdownWrapper
//             label="Piloto"
//             isLoading={isDriverLoading}
//             isFetching={isDriverFetching}
//             isError={isDriverError}
//             items={drivers ?? []}
//             placeholder="Selecciona un piloto"
//             placeholderColor="#71a780"
//             renderItemText={(item) => `${item.names}`}
//             onItemSelected={(item: DriverT) => {
//               setDriverSelected(item);
//             }}
//             refetch={refetchDrivers}
//           />
//         </View>

//         <Space vertical size={15} />

//         <View>
//           <DropdownWrapper
//             label="Cliente"
//             isLoading={isLoadingClients}
//             isFetching={isFetchingClients}
//             isError={isErrorClients}
//             items={clients ?? []}
//             placeholder="Selecciona un cliente"
//             placeholderColor="#71a780"
//             renderItemText={(item) => `${item.name}`}
//             onItemSelected={(item: ClientT) => {
//               setClientSelected(item);
//               triggerOrigins({ clientId: item.clientId });
//               triggerDestinations({ clientId: item.clientId });
//             }}
//             refetch={refetchClients}
//             linkText="Agregar nuevo cliente"
//             onLinkPress={() => console.log('Botón tipo link presionado')}
//           />
//         </View>

//         <Space vertical size={15} />

//         <View>
//           <DropdownWrapper
//             label="Estado"
//             isLoading={isShipmentStatusLoading}
//             isFetching={isShipmentStatusFetching}
//             isError={isShipmentStatusError}
//             items={shipmentStatusList ?? []}
//             placeholder="Selecciona un estado"
//             placeholderColor="#71a780"
//             renderItemText={(item) => `${item.description}`}
//             onItemSelected={(item: ShipmentStatusT) => {
//               handleShipmentStatusSelected(item);
//             }}
//             refetch={refetchShipmentStatus}
//             linkText="Agregar nuevo estado"
//             onLinkPress={() => console.log('Botón tipo link presionado')}
//           />
//         </View>

//         <Space vertical size={20} />

//         {/* ÚNICO botón para traer/generar el reporte */}
//         <View style={{ width: '100%' }}>
//           <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
//             <Text style={styles.buttonText}>Generar reporte</Text>
//           </TouchableOpacity>
//         </View>

//         <Space vertical size={10} />

//         {/* Barra de resultados + botón PDF con Lucide (solo si hay viajes) */}
//         {shipments && shipments.length > 0 && !isLoading && !refreshing && (
//           <View style={styles.pdfBar}>
//             <Text style={styles.resultsText}>{shipments.length} viajes encontrados</Text>

//             <ShipmentsPdfGenerator
//               shipments={shipments}
//               // 👇 Trigger custom con Lucide
//               // Necesita que modifiques ShipmentsPdfGenerator para aceptar este prop
//               renderTrigger={(onGenerate) => (
//                 <TouchableOpacity style={styles.pdfButton} onPress={onGenerate}>
//                   <FileText size={18} color="#fff" />
//                   <Text style={styles.pdfButtonText}>PDF</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         )}

//         <Space vertical size={10} />

//         {/* Errores y loader */}
//         {isError && (
//           <View style={styles.center}>
//             <Text>Algo ocurrió, favor intentar de nuevo</Text>
//           </View>
//         )}

//         {(isLoading || refreshing) && <ActivityIndicator />}

//         {/* Mensaje cuando no hay viajes */}
//         {!shipments?.length && !isUninitialized && !isLoading && !refreshing && (
//           <View>
//             <Space vertical size={60} />
//             {driverSelected || clientSelected || shipmentStatusSelected || startDate || endDate ? (
//               <Text style={{ color: '#71a780', fontWeight: '700', textAlign: 'center' }}>
//                 No se encontraron viajes con el filtro seleccionado
//               </Text>
//             ) : (
//               <Text style={{ color: '#71a780', fontWeight: '700', textAlign: 'center' }}>
//                 No se encontraron viajes
//               </Text>
//             )}
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   searchButton: {
//     backgroundColor: '#71a780',
//     paddingVertical: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   pdfBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   resultsText: {
//     color: '#4a4a4a',
//     fontWeight: '600',
//   },
//   pdfButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2073cdbd',
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//     gap: 6,
//   },
//   pdfButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

// export default Reports;

import React, { FC, useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import { useGetAllClientsQuery } from '@api/clientApi';
import { useGetAllDriversQuery } from '@api/driverApi';
import { DriverT } from '@models/Driver';
import { ClientT, ShipmentStatusT } from '@models/Shipment';
import { useLazyGetOriginsByClientIdQuery } from '@api/originApi';
import { useLazyGetDestinationsByClientIdQuery } from '@api/destinationApi';
import DropdownWrapper from '@components/DropdownWrapper';
import CalendarBox from '@components/CalendarBox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGetAllShipmentsStatusQuery } from '@api/shipmentStatusApi';
import { useLazyGetAllShipmentsQuery } from '@api/shipmentApi';
import ShipmentsPdfGenerator from './ShipmentsPDFGenerator';
import { ActivityIndicator } from '@react-native-material/core';
import { format } from 'date-fns';
import { FileText } from 'lucide-react-native';

const Reports: FC = () => {
  const router = useRouter();

  const {
    data: shipmentStatusList,
    isLoading: isShipmentStatusLoading,
    isFetching: isShipmentStatusFetching,
    isError: isShipmentStatusError,
    refetch: refetchShipmentStatus,
  } = useGetAllShipmentsStatusQuery({});

  const {
    data: drivers,
    isLoading: isDriverLoading,
    isFetching: isDriverFetching,
    isError: isDriverError,
    refetch: refetchDrivers,
  } = useGetAllDriversQuery({});

  const {
    currentData: clients,
    isError: isErrorClients,
    isLoading: isLoadingClients,
    refetch: refetchClients,
    isFetching: isFetchingClients,
  } = useGetAllClientsQuery({});

  const [triggerOrigins] = useLazyGetOriginsByClientIdQuery();
  const [triggerDestinations] = useLazyGetDestinationsByClientIdQuery();

  const [trigger, { data: shipments, isLoading, isError, isUninitialized }] =
    useLazyGetAllShipmentsQuery();

  const [refreshing, setRefreshing] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [driverSelected, setDriverSelected] = useState<DriverT | null>(null);
  const [clientSelected, setClientSelected] = useState<ClientT | null>(null);
  const [shipmentStatusSelected, setShipmentStatusSelected] = useState<ShipmentStatusT | null>(
    null,
  );

  const handleShipmentStatusSelected = (item: ShipmentStatusT | null) => {
    setShipmentStatusSelected(item);
  };

  // Arrays con opción "Todos"
  const driverItems = useMemo(() => {
    if (!drivers || !drivers.length) return [];
    const allOption: DriverT = {
      // @ts-ignore – solo usamos userId y names acá
      userId: -1,
      names: 'Todos',
    };
    return [allOption, ...drivers];
  }, [drivers]);

  const clientItems = useMemo(() => {
    if (!clients || !clients.length) return [];
    const allOption: ClientT = {
      // @ts-ignore
      clientId: -1,
      name: 'Todos',
    };
    return [allOption, ...clients];
  }, [clients]);

  const shipmentStatusItems = useMemo(() => {
    if (!shipmentStatusList || !shipmentStatusList.length) return [];
    const allOption: ShipmentStatusT = {
      // @ts-ignore
      shipmentStatusId: -1,
      description: 'Todos',
    };
    return [allOption, ...shipmentStatusList];
  }, [shipmentStatusList]);

  const handleSearch = useCallback(() => {
    setRefreshing(true);

    const params: Record<string, string> = {};

    if (driverSelected && (driverSelected as any).userId !== -1) {
      params.driverId = `${driverSelected.userId}`;
    }
    if (clientSelected && (clientSelected as any).clientId !== -1) {
      params.clientId = `${clientSelected.clientId}`;
    }
    if (shipmentStatusSelected && (shipmentStatusSelected as any).shipmentStatusId !== -1) {
      // Ajusta el campo según tu API
      // @ts-ignore
      params.shipmentStatusId = `${shipmentStatusSelected.shipmentStatusId}`;
    }

    if (startDate) {
      params.startDate = format(startDate as Date, 'yyyy-MM-dd');
    }
    if (endDate) {
      params.endDate = format(endDate as Date, 'yyyy-MM-dd');
    }

    trigger(params)
      .unwrap()
      .finally(() => setRefreshing(false));
  }, [driverSelected, clientSelected, shipmentStatusSelected, startDate, endDate, trigger]);

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setDriverSelected(null);
    setClientSelected(null);
    setShipmentStatusSelected(null);
    // Opcional: limpiar resultados
    // trigger({}); // si quieres traer "todo" al limpiar, descomenta esto
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader title="Reportes" onBackPress={() => router.back()} showHelpButton={false} />
        <Space vertical size={15} />

        {/* Fechas */}
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
                style={{ width: '200%' }}
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
                style={{ width: '200%', marginLeft: '-100%' }}
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

        <Space vertical size={10} />

        <View>
          <DropdownWrapper
            label="Piloto"
            isLoading={isDriverLoading}
            isFetching={isDriverFetching}
            isError={isDriverError}
            items={driverItems}
            placeholder="Selecciona un piloto"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item.names}`}
            onItemSelected={(item: DriverT) => {
              if ((item as any).userId === -1) {
                setDriverSelected(null); // Todos
              } else {
                setDriverSelected(item);
              }
            }}
            refetch={refetchDrivers}
          />
        </View>

        <View>
          <DropdownWrapper
            label="Cliente"
            isLoading={isLoadingClients}
            isFetching={isFetchingClients}
            isError={isErrorClients}
            items={clientItems}
            placeholder="Selecciona un cliente"
            placeholderColor="#71a780"
            renderItemText={(item) => `${item.name}`}
            onItemSelected={(item: ClientT) => {
              if ((item as any).clientId === -1) {
                setClientSelected(null); // Todos
              } else {
                setClientSelected(item);
                triggerOrigins({ clientId: item.clientId });
                triggerDestinations({ clientId: item.clientId });
              }
            }}
            refetch={refetchClients}
            linkText="Agregar nuevo cliente"
            onLinkPress={() => console.log('Botón tipo link presionado')}
          />
        </View>

        <Space vertical size={20} />

        {/* Botones: Limpiar filtros + Generar reporte */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Generar reporte</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Space vertical size={10} />

        {/* Barra de resultados + botón PDF con Lucide (solo si hay viajes) */}
        {shipments && shipments.length > 0 && !isLoading && !refreshing && (
          <View style={styles.pdfBar}>
            <Text style={styles.resultsText}>{shipments.length} viajes encontrados</Text>

            <ShipmentsPdfGenerator
              shipments={shipments}
              renderTrigger={(onGenerate) => (
                <TouchableOpacity style={styles.pdfButton} onPress={onGenerate}>
                  <FileText size={18} color="#fff" />
                  <Text style={styles.pdfButtonText}>PDF</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <Space vertical size={10} />

        {/* Errores y loader */}
        {isError && (
          <View style={styles.center}>
            <Text>Algo ocurrió, favor intentar de nuevo</Text>
          </View>
        )}

        {(isLoading || refreshing) && <ActivityIndicator />}

        {/* Mensaje cuando no hay viajes */}
        {!shipments?.length && !isUninitialized && !isLoading && !refreshing && (
          <View>
            <Space vertical size={60} />
            {driverSelected || clientSelected || shipmentStatusSelected || startDate || endDate ? (
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#71a780',
    paddingVertical: 10,
    borderRadius: 5,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#71a780',
    paddingVertical: 10,
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#71a780',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pdfBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2073cdbd',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  pdfButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Reports;
