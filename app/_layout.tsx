import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@hooks/useColorScheme';
import { Provider } from 'react-redux';
import store from 'store/configureStore';
import { ActivityIndicator, View } from 'react-native';
import checkToken from 'utils/checkToken';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [initialRoute, setInitialRoute] = useState<'home' | 'sign-in' | null>(null);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const initialize = async () => {
      const isLoggedIn = await checkToken();
      setInitialRoute(isLoggedIn ? 'home' : 'sign-in');
    };

    initialize();
  }, []);

  if (!loaded) {
    return null;
  }

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <Stack initialRouteName={initialRoute ?? 'sign-in'} screenOptions={_ => ({ headerShown: false })}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="home" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Provider>
    </ThemeProvider>
  );
}

export default RootLayout;
