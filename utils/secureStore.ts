import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

export const saveToken = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const deleteToken = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getDecodedToken = (token: string): Record<string, any> | null => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getValidToken = async (
  accessTokenKey: string,
  refreshTokenKey: string,
  refreshTokenFunction: (refreshToken: string) => Promise<{ accessToken: string}>
): Promise<string | null> => {
  try {
    const accessToken = await getToken(accessTokenKey);
    console.log('valid token accessToken ', accessToken);
    if (accessToken && !isTokenExpired(accessToken)) {
      return accessToken;
    }

    const refreshToken = await getToken(refreshTokenKey);
    console.log('valid token refreshToken ', refreshToken)
    if (refreshToken) {
      const { accessToken } = await refreshTokenFunction(refreshToken);
      console.log('accessTokenKey ', accessTokenKey, ' newAccessToken ', accessToken)
      if (accessToken) {
        await saveToken(accessTokenKey, accessToken);
        return accessToken;
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting valid token:', error);
    return null;
  }
};

export const saveUserName = async (name: string) => {
  try {
    await SecureStore.setItemAsync('userName', name);
  } catch (error) {
    console.error('Error saving username:', error);
  }
};

export const getUserName = async () => {
  try {
    const name = await SecureStore.getItemAsync('userName');
    return name || '';
  } catch (error) {
    console.error('Error retrieving username:', error);
    return '';
  }
};
