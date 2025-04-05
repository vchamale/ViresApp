import { useLazyRefreshTokenQuery, useLoginMutation } from "@api/authApi";
import Space from "@components/Space";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import IconMapper from "@components/IconMapper";
import { getDecodedToken, saveToken, saveUserName } from "utils/secureStore";
import { Screen } from "react-native-screens";
import { checkDeviceForBiometrics } from "utils/biometrics/checkDeviceForBiometrics";
import { authenticate } from "utils/biometrics/authenticate";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignIn: React.FC = () => {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmptyEmailAlert, setEmptyEmailAlert] = useState<boolean>(false);
  const [isEmptyPasswordAlert, setEmptyPasswordAlert] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState<boolean>(false);

  // Refs
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Api calls
  const [login] = useLoginMutation();
  const [triggerRefreshToken] = useLazyRefreshTokenQuery();

  // Hooks
  const router = useRouter();

  // effects
  useEffect(() => {
    const handleBackPress = () => {
      // Bloquea el botón de retroceso en Android
      return true; // Previene que el sistema cierre la app
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const compatible = await checkDeviceForBiometrics();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  // Functions
  const onSubmit = async () => {
    setLoading(true);
    try {
      if (!email) {
        setEmptyEmailAlert(true);
        setTimeout(() => setEmptyEmailAlert(false), 2000);
        setLoading(false);
        return;
      }
      if (!password) {
        setEmptyPasswordAlert(true);
        setTimeout(() => setEmptyPasswordAlert(false), 2000);
        setLoading(false);
        return;
      }

      // Call login mutation
      const response: { accessToken: string, refreshToken: string } = await login({ email, password }).unwrap();
      if (response?.accessToken) {
        await saveToken('accessToken', response.accessToken);
        await saveToken('refreshToken', response.refreshToken);
        const { name } = getDecodedToken(response?.accessToken) ?? {};
        if (name) {
          await saveUserName(name);
        }
        router.push("/(tabs)");
      }
    } catch (err) {
      console.error(err);
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
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <IconMapper iconName="mail-outline" size={20} color="#5db075" />
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#5db075"
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
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
                onChangeText={setPassword}
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

            {isBiometricSupported && (
              <TouchableOpacity
              style={{ alignItems: 'center', padding: 30 }}
              onPress={async () => {
                try {
                  const isAuthenticated = await authenticate(async (refreshToken) => {
                    const { accessToken } = await triggerRefreshToken({ refreshToken }).unwrap();
                    return accessToken;
                  });
            
                  if (isAuthenticated) {
                    router.push('/(tabs)');
                  }
                } catch (error) {
                  console.error('Error en autenticación biométrica:', error);
                }
              }}
            >
              <MaterialCommunityIcons name="face-recognition" size={90} color="white" />
            </TouchableOpacity>
            )}
          </View>
        </View>
      </Screen>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7193654f",
    justifyContent: "center",
    alignContent: 'center',
  },
  background: {
    flex: 1,
    padding: 20,
    elevation: 4,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: "#fff",
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#71a780",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#71a780",
    fontSize: 16,
  },
  passwordToggle: {
    padding: 5,
  },
  forgotPasswordText: {
    color: "#71a780",
    textAlign: "right",
    fontSize: 14,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: "#71a780",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    color: "#fff",
  },
  registerText: {
    fontSize: 16,
    color: "#71a780",
    fontWeight: "bold",
    marginTop: 5,
  },
  snackbar: {
    position: "absolute",
    start: 16,
    end: 16,
    bottom: 30,
    backgroundColor: "red",
  },
});

export default SignIn;
