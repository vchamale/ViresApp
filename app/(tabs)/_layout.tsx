import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const router = useRouter()
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#71a780', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shipment"
        options={{
          title: 'Viajes',
          tabBarIcon: ({ color }) => <Feather name="truck" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-shipment"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.fabButton}
              onPress={() => {
                router.push('/shipments/create/add-shipment-client')
              }}
            >
              <View style={styles.fabIconContainer}>
                <FontAwesome name="plus" size={22} color="white" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="management"
        options={{
          title: 'Mantenimiento',
          tabBarIcon: ({ color }) => <SimpleLineIcons name="puzzle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuration"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'white',
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 5,
  },
  fabButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#71a780',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
});
