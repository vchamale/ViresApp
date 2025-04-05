// import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { deleteToken, getToken, isTokenExpired } from '../../utils/secureStore';
// import { router } from 'expo-router';
// import { Alert } from 'react-native';

// const createBaseQuery = (baseUrl: string) =>
//   fetchBaseQuery({
//     baseUrl,
//     timeout: 3000,
//     headers: { 'Content-type': 'application/json' },
//     prepareHeaders: async (headers) => {
//       const token = await getToken('accessToken');
//       if (token && !isTokenExpired(token)) {
//         headers.set('Authorization', `Bearer ${token}`);
//         return headers;
//       }
//       await deleteToken('accessToken');

//       Alert.alert(
//         'Sesión Expirada',
//         'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
//         [
//           {
//             text: 'Aceptar',
//             onPress: () => router.replace('/sign-in'),
//           },
//         ],
//         { cancelable: false }
//       );
//     },
//   });

// export default createBaseQuery;



import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { handleTokenValidation } from '../../utils/handleTokenValidation';

const createBaseQuery = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' },
    prepareHeaders: async (headers, { dispatch }: any) => {
      const token = await handleTokenValidation(dispatch); // Validar token antes de la petición

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });

  return async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      console.warn('Respuesta 401 - cerrando sesión');
      await handleTokenValidation(api.dispatch);
      return { error: { status: 401, message: 'Unauthorized' } };
    }

    return result;
  };
};

export default createBaseQuery;