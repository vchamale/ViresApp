import { router } from 'expo-router';
import { Dispatch } from '@reduxjs/toolkit';
// import { resetStore } from 'store/reducers';
import { deleteToken, getToken, isTokenExpired } from 'utils/secureStore';
import { Alert } from 'react-native';

/**
 * Maneja la verificación y expiración del token.
 * - Si el token ha expirado, lo elimina, limpia Redux y redirige al login.
 * - Si el backend responde con un 401, también forzará el logout.
 */
export const handleTokenValidation = async (dispatch?: Dispatch) => {
  const token = await getToken('accessToken');

  if (!token || isTokenExpired(token)) {
    console.warn('Token expirado - cerrando sesión');
    await deleteToken('accessToken');

    Alert.alert(
      'Sesión Expirada',
      'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      [
        {
          text: 'Aceptar',
          onPress: () => {
            if (dispatch) {
              dispatch({ type: 'RESET_STORE' }); // Dispara el reset de Redux
            }
            router.replace('/sign-in'); // Redirigir al login
          },
        },
      ],
      { cancelable: false }
    );

    return null;
  }

  return token;
};