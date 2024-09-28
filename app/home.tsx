import Space from "@components/Space";
import { useRouter } from "expo-router";
import { FC } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";

type HomePropsT = {
  navigation: any;
}

const Home: FC<HomePropsT> = ({ navigation }) => {

  // hooks
  const router = useRouter();

  return <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, padding: 15 }}>
      <Space vertical size={10} />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View></View>
        <View style={{
          marginRight: 10
        }}>
          <Pressable onPress={() => {
            router.push('/sign-in');
          }}>
            <Text style={{
              color: '#5db075',
              fontSize: 20
            }}>Salir</Text>
          </Pressable>
        </View>
      </View>
      <Space vertical size={10} />
      <View
        style={{
          width: '100%',
          borderColor: '#ddd9d9eb',
          backgroundColor: '#e7e7e7c2',
          borderWidth: 1.5,
          borderRadius: 25
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
          onChangeText={val => { }}
          value={''}
          placeholder="Buscar"
          placeholderTextColor="#989393"
          keyboardType="default"
        />
      </View>
      <Space vertical size={50} />
      <View style={{
        flexDirection: 'row'
      }}>
        <View style={{
          width: '45%',
          marginLeft: 10,
          marginRight: 5
        }}>
          <Pressable onPress={() => {
            router.push('/travel')
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <View style={{
                flexDirection: 'column'
              }}>
                <View style={{
                  backgroundColor: '#5db075',
                  padding: 60,
                  borderRadius: 8
                }}>
                  <Text>img</Text>
                </View>
                <Space vertical size={10} />
                <Text style={{ textAlign: 'center', color: '#5db075' }}>Viajes</Text>
              </View>
            </View>
          </Pressable>
        </View>
        <View style={{
          width: '45%',
          marginLeft: 10,
          marginRight: 5
        }}>
          <Pressable onPress={() => {
            router.push('/customer')
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <View style={{
                flexDirection: 'column'
              }}>
                <View style={{
                  backgroundColor: '#5db075',
                  padding: 60,
                  borderRadius: 8
                }}>
                  <Text>img</Text>
                </View>
                <Space vertical size={10} />
                <Text style={{ textAlign: 'center', color: '#5db075' }}>Clientes</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  </SafeAreaView>
};

export default Home