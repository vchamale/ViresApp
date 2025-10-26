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
