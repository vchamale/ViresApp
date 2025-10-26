import { useLazyRefreshTokenQuery, useLoginMutation } from '@api/authApi';
import Space from '@components/Space';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import IconMapper from '@components/IconMapper';
import { getDecodedToken, saveToken, saveUserName } from 'utils/secureStore';
import { Screen } from 'react-native-screens';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [login] = useLoginMutation();
  const [triggerRefreshToken] = useLazyRefreshTokenQuery();

  const router = useRouter();

  useEffect(() => {
    const handleBackPress = () => {
      // Block back button
      return true; // Prevent from shutting down the app
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (!email) {
        setErrorMessage('Por favor ingresa tu correo electrónico.');
        setLoading(false);
        return;
      }

      if (!password) {
        setErrorMessage('Por favor ingresa tu contraseña.');
        setLoading(false);
        return;
      }

      const { accessToken, refreshToken } = await login({ email, password }).unwrap();
      if (accessToken) {
        await saveToken('accessToken', accessToken);
        await saveToken('refreshToken', refreshToken);
        const { name } = getDecodedToken(accessToken) ?? {};
        if (name) {
          await saveUserName(name);
        }
        router.push('/(tabs)');
      }
    } catch (err: unknown) {
      if ((err as FetchBaseQueryError).status === 'FETCH_ERROR') {
        setErrorMessage('Error de red. Por favor, verifica tu conexión a internet.');
      } else if ((err as any).status === 400) {
        setErrorMessage('Credenciales inválidas. Por favor, verifica tus datos.');
      } else if ((err as any).status === 500) {
        setErrorMessage('Error del servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Screen gestureEnabled={false} style={styles.container}>
        <Space vertical size={100} />
        <View style={styles.background}>
          <View style={styles.header}>
            <Space vertical size={20} />
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>
          <Space vertical size={30} />
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <IconMapper iconName="mail-outline" size={20} color="#5db075" />
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#5db075"
                value={email}
                onChangeText={(text) => {
                  setEmail(text.toLowerCase());
                  if (errorMessage) setErrorMessage(null);
                }}
                keyboardType="email-address"
              />
            </View>
            <Space vertical size={15} />
            <View style={styles.inputContainer}>
              <IconMapper iconName="lock-closed-outline" size={20} color="#5db075" />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#5db075"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                secureTextEntry
              />
            </View>
            <Space vertical size={30} />
            <TouchableOpacity style={styles.loginButton} onPress={onSubmit}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7193654f',
    justifyContent: 'center',
    alignContent: 'center',
  },
  background: {
    flex: 1,
    padding: 20,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#71a780',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#71a780',
    fontSize: 16,
  },
  passwordToggle: {
    padding: 5,
  },
  forgotPasswordText: {
    color: '#71a780',
    textAlign: 'right',
    fontSize: 14,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: '#71a780',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#fff',
  },
  registerText: {
    fontSize: 16,
    color: '#71a780',
    fontWeight: 'bold',
    marginTop: 5,
  },
  snackbar: {
    position: 'absolute',
    start: 16,
    end: 16,
    bottom: 30,
    backgroundColor: 'red',
  },
  errorBanner: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorBannerText: {
    color: '#721c24',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SignIn;
