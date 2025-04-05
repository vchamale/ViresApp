import { useRouter } from "expo-router";
import { FC, useEffect } from "react";
import { BackHandler, SafeAreaView } from "react-native";
import checkToken from "utils/checkToken";

type HomePropsT = {
  navigation: any;
};

const Index: FC<HomePropsT> = ({ navigation }) => {

  const router = useRouter();

  // effects
  useEffect(() => {
    const handleBackPress = () => {
      // Bloquea el botón de retroceso en Android
      return true; // Previene que el sistema cierre la app
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const isLoggedIn = await checkToken();
      const route = isLoggedIn ? '/home' : '/sign-in'
      router.push(route);
    };

    initialize();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
    </SafeAreaView>
  );
};

export default Index;
