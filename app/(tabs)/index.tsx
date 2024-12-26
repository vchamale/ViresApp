import { FC, useEffect, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import PagerView from "react-native-pager-view";
import { useRouter } from "expo-router";
import Space from "@components/Space";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BlurView } from "expo-blur";
import TruckImage from "../../assets/images/current_trucks.webp";
import TruckMountingImage from "../../assets/images/truck_mounting.webp";
import ShipmentFinished from "../../assets/images/shipment_finished.webp";

type HomePropsT = {
  navigation: any;
};

const Home: FC<HomePropsT> = () => {
  // hooks
  const router = useRouter();

  // Refs
  const pagerRef = useRef<PagerView>(null);

  // State
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      key: 1,
      title: "Viajes en Curso",
      description: "",
      imageBackground: TruckImage,
      route: "/current-trips",
    },
    {
      key: 2,
      title: "Viajes Creados",
      description: "",
      imageBackground: TruckMountingImage,
      route: "/created-trips",
    },
    {
      key: 3,
      title: "Viajes Finalizados",
      description: "",
      imageBackground: ShipmentFinished,
      route: "/finished-trips",
    },
  ];

  const intervalTime = 3000; // Tiempo en milisegundos entre cambios

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % pages.length;
      pagerRef.current?.setPage(currentIndex); // Cambia de página
    }, intervalTime);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [pages.length]);

  const handlePageSelected = (e: any) => {
    setCurrentPage(e.nativeEvent.position); // Actualiza la página actual al cambiar
  };

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  const today = new Date(); // Fecha de hoy
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: es });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 15 }}>
        <Space vertical size={10} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontWeight: "700", fontSize: 20 }}>Hola Kevin</Text>
            <Space vertical size={10} />
            <Text style={{ color: "#525358" }}>{formattedDate}</Text>
          </View>
          <View style={{ marginRight: 10 }}>
            <Pressable
              onPress={() => {
                router.push("./login/sign-in");
              }}
            >
              <Text style={{ color: "#5db075", fontSize: 20 }}>Salir</Text>
            </Pressable>
          </View>
        </View>
        <Space vertical size={10} />
        <PagerView
          style={styles.container}
          initialPage={0}
          ref={pagerRef}
          onPageSelected={handlePageSelected}
        >
          {pages.map((page) => (
            <View style={[styles.page, styles.pageContainer]} key={page.key}>
              <ImageBackground
                source={page.imageBackground}
                style={styles.imageBackground}
                resizeMode="cover"
              >
                <BlurView intensity={0} style={styles.blurView}>
                  <Text style={styles.pageTitle}>{page.title}</Text>
                  <Text style={styles.pageSubtitle}>{page.description}</Text>
                  <TouchableOpacity
                    style={styles.navigateButton}
                    onPress={() => handleNavigate(page.route)}
                  >
                    <Text style={styles.navigateButtonText}>Ir</Text>
                  </TouchableOpacity>
                </BlurView>
              </ImageBackground>
            </View>
          ))}
        </PagerView>
        <Space vertical size={10} />
        <View style={styles.indicatorContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentPage === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        <Space vertical size={50} />
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  pageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  blurView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 10,
    paddingTop: 10,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  pageTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 20,
    textAlign: "center",
  },
  pageSubtitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#5db075",
  },
  navigateButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#88c69ad4",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  navigateButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Home;
