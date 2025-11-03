import { deleteToken } from '../utils/secureStore';
import { useRouter } from 'expo-router';

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    // Elimina el token de almacenamiento seguro
    await deleteToken('accessToken');

    // Redirige a la pantalla de inicio de sesión
    router.replace('/sign-in');
  };

  return logout;
};

export default useLogout;
