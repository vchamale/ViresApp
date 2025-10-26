import { FC } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import IconMapper from '@components/IconMapper';

const Management: FC = () => {
  const router = useRouter();

  const options = [
    { label: 'Póliza', path: '/documents', size: 21, iconName: 'document-text-outline' },
    // { label: "Contenedor", path: "/shipments/create/add-shipment-client", size: 17, iconName: "container" },
    { label: 'Destino', path: '/destination', size: 15, iconName: 'map' },
    { label: 'Punto de Partida', path: '/origin', size: 20, iconName: 'map-marker-outline' },
    { label: 'Vehículo', path: '/vehicles', size: 20, iconName: 'truck-outline' },
    { label: 'Piloto', path: '/drivers', size: 16, iconName: 'drivers-license-o' },
    { label: 'Cliente', path: '/clients', size: 20, iconName: 'user' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader title="Mantenimiento" showBackButton={false} />
        <Space vertical size={40} />
        <View>
          {options.map((option, index) => (
            <View key={index} style={styles.card}>
              <Pressable
                onPress={() => {
                  router.push(option.path);
                }}
              >
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    <IconMapper iconName={option.iconName} size={option.size} color="#fff" />
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.label}>{option.label}</Text>
                  </View>
                  <View style={styles.rowButton}>
                    <IconMapper iconName="chevron-right" size={25} color="#fff" />
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
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
  card: {
    backgroundColor: '#88c69ad4',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 15,
    marginVertical: 5,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconContainer: {
    alignContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16,
  },
  viewButton: {
    backgroundColor: '#5db075',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 25,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default Management;
