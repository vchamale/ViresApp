import { AppDispatch, persistor } from 'store/configureStore';
import { deleteToken } from '../utils/secureStore';
import { router } from 'expo-router';
import { resetStore } from 'store/reducers';
import { Alert } from 'react-native';

export const handleLogout = async (dispatch: AppDispatch) => {
  await deleteToken('accessToken'); // Borra el token de almacenamiento seguro
  persistor.purge(); // Borra Redux Persist (borra AsyncStorage)
  dispatch(resetStore()); // Reinicia el estado en Redux
  Alert.alert(
    'Sesión Expirada',
    'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    [
      {
        text: 'Aceptar',
        onPress: () => router.replace('/sign-in'),
      },
    ],
    { cancelable: false },
  );
};
