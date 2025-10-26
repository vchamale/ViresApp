import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import Space from '@components/Space';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BlurView } from 'expo-blur';
import useLogout from '@hooks/useLogout';
import { useUserName } from '@hooks/useUserName';

const { width: viewportWidth } = Dimensions.get('window');

const pages = [
  {
    key: 1,
    title: 'Viajes en Curso',
    description: '',
    imageBackground: require('../../assets/images/current_trucks.webp'),
    route: '/(tabs)/shipment',
    searchTerm: 'RUTA',
  },
  {
    key: 2,
    title: 'Viajes Creados',
    description: '',
    imageBackground: require('../../assets/images/truck_mounting.webp'),
    route: '/(tabs)/shipment',
    searchTerm: 'CREADO',
  },
  {
    key: 3,
    title: 'Viajes Finalizados',
    description: '',
    imageBackground: require('../../assets/images/shipment_finished.webp'),
    route: '/(tabs)/shipment',
    searchTerm: 'FINALIZADO',
  },
];

const Home = () => {
  // hooks
  const router = useRouter();
  const name = useUserName();

  const logout = useLogout();

  const today = new Date(); // Fecha de hoy
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: es });

  const renderItem = ({ item }: { item: (typeof pages)[0] }) => (
    <View style={styles.slide}>
      <ImageBackground
        source={item.imageBackground}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <BlurView intensity={0} style={styles.blurView}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: item.route,
                params: { searchTermParam: item.searchTerm },
              })
            }
          >
            <Text style={styles.buttonText}>Ir</Text>
          </TouchableOpacity>
        </BlurView>
      </ImageBackground>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 15 }}>
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
        <Carousel
          style={styles.carousel}
          data={pages}
          renderItem={renderItem}
          width={viewportWidth - 20}
          height={200}
          autoPlay={true}
          autoPlayInterval={3000}
          loop={true}
          scrollAnimationDuration={1000}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  carousel: {
    flex: 1,
  },
  blurView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // paddingLeft: 10,
    // paddingTop: 10,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
    // textAlign: "center",
  },
  button: {
    // marginTop: 10,
    // backgroundColor: "#5db075",
    // padding: 10,
    // borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#88c69ad4',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;
