import * as LocalAuthentication from 'expo-local-authentication';
import { getValidToken } from 'utils/secureStore';

export async function authenticate(
  refreshTokenMutation: (refreshToken: string) => Promise<{ accessToken: string }>,
) {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación biométrica requerida',
      fallbackLabel: 'Usar contraseña', // (Opcional) Solo para iOS
      cancelLabel: 'Cancelar', // (Opcional) Solo para Android
    });

    if (result.success) {
      console.log('Biometric authentication successful');

      // Obtener token válido usando la función reutilizable
      const token = await getValidToken('accessToken', 'refreshToken', refreshTokenMutation);

      if (token) {
        return token;
      } else {
        throw new Error('No valid token available, please log in again.');
      }
    } else {
      throw new Error('Biometric authentication failed');
    }
  } catch (error) {
    console.error('Error al autenticar:', error);
    return false;
  }
}
