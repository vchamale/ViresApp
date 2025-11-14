import { FC } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import MenuOptionsList from '@components/MenuOptionsList';

const Management: FC = () => {
  const options = [
    //{ label: 'Póliza', path: '/documents', size: 21, iconName: 'document-text-outline' },
    // { label: "Contenedor", path: "/shipments/create/add-shipment-client", size: 17, iconName: "container" },
    // { label: 'Destino', path: '/destination', size: 15, iconName: 'map' },
    // { label: 'Punto de Partida', path: '/origin', size: 20, iconName: 'map-marker-outline' },
    { label: 'Vehículo', path: '/vehicles', size: 20, iconName: 'truck-outline' },
    { label: 'Piloto', path: '/drivers', size: 16, iconName: 'drivers-license-o' },
    { label: 'Clientes', path: '/clients', size: 20, iconName: 'user' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader title="Mantenimiento" showBackButton={false} />
        <Space vertical size={40} />
        <MenuOptionsList options={options} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5db075',
  },
});

export default Management;
