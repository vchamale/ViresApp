import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const checkToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    return false;
  }
  
  const decoded = { exp: 123 } //jwtDecode(token);
  const currentTime = Date.now() / 1000;
  
  if (decoded.exp < currentTime) {
    return false;
  }

  return true;
};

export default checkToken;
