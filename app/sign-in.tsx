import Space from "@components/Space";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";


type Props = {
  navigation: any;
};

const SignIn: React.FC<Props> = ({ navigation }) => {

  // state
  const [email, setEmail] = useState('');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);

  // requests
  // const [login] = useLoginMutation();

  // hooks
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
        router.push('/home');
      }, 1000);
      // const { data, error } = await login({
      //   usuario: user,
      //   clave: password
      // });
    } catch (err) {
      console.error(err);
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
              onChangeText={val => setEmail(val.trim())}
              value={email}
              placeholder="Correo"
              placeholderTextColor="#989393"
              keyboardType="default"
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
              onChangeText={val => setPassword(val.trim())}
              value={password}
              placeholder="Contraseña"
              placeholderTextColor="#989393"
              keyboardType="default"
            />
            <View style={{
              justifyContent: 'center'
            }}>
              <Pressable
                onPressIn={() => {
                  setPasswordVisible(true);
                }}
                onPressOut={() => {
                  setPasswordVisible(false);
                }}>
                  <Text>{isPasswordVisible ? '' : 'Mostrar'}</Text>
              </Pressable>
            </View>
          </View>
          <Space vertical size={20} />
          <View style={{
          }}>
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
    </SafeAreaView>
  );
};

export default SignIn;
