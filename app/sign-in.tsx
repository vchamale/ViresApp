import { useLoginMutation } from "@api/authApi";
import Space from "@components/Space";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { Snackbar } from "@react-native-material/core";


type Props = {
  navigation: any;
};

const SignIn: React.FC<Props> = ({ navigation }) => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmptyEmailAlert, setEmptyEmailAlert] = useState<boolean>(false);
  const [isEmptyPasswordAlert, setEmptyPasswordAlert] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  // Refs
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // requests
  const [login] = useLoginMutation();

  // hooks
  const router = useRouter();

  // Functions
  const onSubmit = async () => {
    setLoading(true);
    try {
      // Accessing the state directly for email and password
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

      const { data, error } = await login({ email, password });
      console.log('data ', data, ' error ', error)
      if (error) {
        return;
      }

      if (data?.token) {
        router.push('/home');
      }

      // console.log('data ', data, ' error ', error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 10, backgroundColor: 'white' }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'Roboto-Regular'
              }}>
              Iniciar Sesión
            </Text>
          </View>
          <Space vertical size={30} />
          <View
            style={{
              width: '100%',
              borderColor: '#ddd9d9eb',
              backgroundColor: '#e7e7e7c2',
              borderWidth: 1.5,
              borderRadius: 10
            }}>
            <TextInput
              ref={emailRef}
              style={{
                color: '#2c4778',
                fontWeight: '600',
                fontSize: 15,
                borderColor: '#fff',
                borderWidth: 0,
                padding: 10,
                paddingRight: 0
              }}
              editable={true}
              onChangeText={(text: string) => { setEmail(text.toLowerCase()) }}  // Using setState directly
              value={email}  // Binding the value to the state
              placeholder="Correo"
              placeholderTextColor="#989393"
              keyboardType="email-address"
            />
          </View>
          <Space vertical size={15} />
          <View
            style={{
              width: '100%',
              borderColor: '#ddd9d9eb',
              backgroundColor: '#e7e7e7c2',
              flexDirection: 'row',
              borderWidth: 1.5,
              borderRadius: 10
            }}>
            <TextInput
              ref={passwordRef}
              secureTextEntry={!isPasswordVisible}
              style={{
                width: '80%',
                color: '#2c4778',
                fontWeight: '600',
                fontSize: 15,
                borderColor: '#fff',
                borderWidth: 0,
                padding: 10,
                paddingRight: 0
              }}
              editable={true}
              onChangeText={setPassword}  // Using setState directly
              value={password}  // Binding the value to the state
              placeholder="Contraseña"
              placeholderTextColor="#989393"
              keyboardType="default"
            />
            <View style={{
              justifyContent: 'center'
            }}>
              <Pressable
                onPressIn={() => setPasswordVisible(true)}
                onPressOut={() => setPasswordVisible(false)}>
                <Text>{isPasswordVisible ? 'Ocultar' : 'Mostrar'}</Text>
              </Pressable>
            </View>
          </View>
          <Space vertical size={20} />
          <View>
            {!isLoading ? (
              <View style={{
                width: '100%',
                borderRadius: 25,
                backgroundColor: '#5db075',
                flexDirection: 'row',
                justifyContent: 'center'
              }}>
                <Pressable onPress={onSubmit}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '700',
                      paddingVertical: 15,
                      fontFamily: 'Roboto-Regular'
                    }}>
                    Iniciar Sesión
                  </Text>
                </Pressable>
              </View>
            ) : (
              <ActivityIndicator size={50} />
            )}
          </View>
          <Space vertical size={20} />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            <Pressable
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={{ color: '#5db075' }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      {
        isEmptyEmailAlert && 
          <Snackbar
            message="Debes ingresar tu email."
            style={{ position: "absolute", start: 16, end: 16, bottom: 30, backgroundColor: 'red' }}
          />
      }
      {
        isEmptyPasswordAlert && 
          <Snackbar
            message="Debes ingresar tu contraseña."
            style={{ position: "absolute", start: 16, end: 16, bottom: 30, backgroundColor: 'red' }}
          />
      }
    </SafeAreaView>
  );
};

export default SignIn;
