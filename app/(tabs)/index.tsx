import React from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Space from '@components/Space';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useLogout from '@hooks/useLogout';
import { useUserName } from '@hooks/useUserName';
import MenuOptionsList from '@components/MenuOptionsList';
import ImageNavigationCard from '@components/ImageNavigationCard';

const options = [
  { label: 'Viajes', path: '/shipment', size: 20, iconName: 'truck-outline' },
  { label: 'Clientes', path: '/clients', size: 20, iconName: 'user' },
  { label: 'Reportes', path: '/reports', size: 20, iconName: 'user' },
];

const Home = () => {
  // hooks
  const router = useRouter();
  const name = useUserName();

  const logout = useLogout();

  const today = new Date(); // Fecha de hoy
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: es });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 15 }}>
        <Space vertical size={10} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontWeight: '700', fontSize: 20 }}>Hola {name || 'Invitado'}</Text>
            <Space vertical size={10} />
            <Text style={{ color: '#525358' }}>{formattedDate}</Text>
          </View>
          <View style={{ marginRight: 10 }}>
            <Pressable onPress={logout}>
              <Text style={{ color: '#5db075', fontSize: 20 }}>Salir</Text>
            </Pressable>
          </View>
        </View>
        <Space vertical size={10} />
        <ImageNavigationCard
          title="Crear Viaje"
          imageBackground={require('../../assets/images/current_trucks.webp')}
          route="/shipments/create/single/create"
          searchTerm="RUTA"
          height={200}
        />
        <Space vertical size={20} />
        <MenuOptionsList options={options} />
      </View>
    </SafeAreaView>
  );
};

export default Home;
