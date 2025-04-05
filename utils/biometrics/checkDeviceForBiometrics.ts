import * as LocalAuthentication from 'expo-local-authentication';

export async function checkDeviceForBiometrics() {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    console.log('El dispositivo no soporta autenticación biométrica.');
    return false;
  }

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  console.log('Tipos de biometría disponibles:', types);
  return true;
}
