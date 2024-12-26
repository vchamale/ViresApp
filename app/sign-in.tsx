import { useLoginMutation } from "@api/authApi";
import Space from "@components/Space";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "@react-native-material/core";
import IconMapper from "@components/IconMapper";

const SignIn: React.FC = () => {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmptyEmailAlert, setEmptyEmailAlert] = useState<boolean>(false);
  const [isEmptyPasswordAlert, setEmptyPasswordAlert] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  // Refs
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Requests
  const [login] = useLoginMutation();

  // Hooks
  const router = useRouter();

  // Functions
  const onSubmit = async () => {
    setLoading(true);
    try {
      // if (!email) {
      //   setEmptyEmailAlert(true);
      //   setTimeout(() => setEmptyEmailAlert(false), 2000);
      //   setLoading(false);
      //   return;
      // }
      // if (!password) {
      //   setEmptyPasswordAlert(true);
      //   setTimeout(() => setEmptyPasswordAlert(false), 2000);
      //   setLoading(false);
      //   return;
      // }

      // // Call login mutation (mocked here)
      // const response = await login({ email, password });
      // if (response?.data?.token) {
        router.push("/(tabs)");
      // }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              onChangeText={setEmail}
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
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              <IconMapper
                iconName={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#5db075"
              />
            </TouchableOpacity>
          </View>
          <Space vertical size={15} />
          <TouchableOpacity onPress={() => router.push("./forgot-password")}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <Space vertical size={30} />
          <TouchableOpacity style={styles.loginButton} onPress={onSubmit}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>
        <Space vertical size={30} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => router.push("./register")}>
            <Text style={styles.registerText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
        {isEmptyEmailAlert && (
          <Snackbar
            message="Debes ingresar tu correo electrónico."
            style={styles.snackbar}
          />
        )}
        {isEmptyPasswordAlert && (
          <Snackbar
            message="Debes ingresar tu contraseña."
            style={styles.snackbar}
          />
        )}
      </View>
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
